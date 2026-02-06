import { Alert } from "react-native";
import { create } from "zustand";

// Importe as funções puras de storage (não os hooks)
import { apiQrCode } from "../services/api";
import { getProductsStorage, getUserStorage, getVoucherStorage, setProductsStorage, setVoucherStorage } from "../storage/storage";
import type { VouchersStorage } from "../storage/storage.types";
import { currentDateTimeDB } from "../utils/date.utils";
import { hasNetwork } from "../utils/net";

// Tipagem da resposta da API (ajuste conforme seu backend real)
interface SyncResponse {
  status: 'success' | 'error';
  message?: string;
  inserted_ids?: string[]; // IDs ou códigos que foram salvos com sucesso
}

type VouchersState = {
  vouchers: VouchersStorage[];

  // Actions
  addVoucher: (data: Partial<VouchersStorage>) => Promise<void>;
  sendStorageData: () => Promise<void>;
  verifyAsyncData: () => Promise<void>;
  sync: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useVouchersStore = create<VouchersState>((set, get) => ({
  vouchers: [],

  // 1. Carrega dados ao abrir o app
  loadFromStorage: async () => {
    // 1. Pega os vouchers salvos
    const storedVouchers = await getVoucherStorage();

    if (storedVouchers) {
      // 2. Pega os produtos salvos para atualizar a contagem
      const storedProducts = await getProductsStorage();

      if (storedProducts.length > 0) {

        // Dicionário para contar rápido: { "ID_DO_PRODUTO": QUANTIDADE }
        const contagem: Record<string, number> = {};

        // Conta quantas vezes cada produto aparece nos vouchers
        storedVouchers.forEach(voucher => {
          const id = String(voucher.id_produto);
          contagem[id] = (contagem[id] || 0) + 1;
        });

        // Atualiza a lista de produtos
        const produtosAtualizados = storedProducts.map(prod => {
          const id = String(prod.id);
          return {
            ...prod,
            impressoes: contagem[id] || 0 // Atualiza ou zera se não tiver impresso
          };
        });

        // Salva os produtos atualizados de volta no storage
        // Assim a Home vai ler os dados corretos
        await setProductsStorage(produtosAtualizados);
        // console.log("Contagem de impressões atualizada nos produtos.");
      }

      // Atualiza o estado da store
      set({ vouchers: storedVouchers });
    }
  },

  // 2. Adiciona um novo voucher (chamado ao clicar em imprimir)
  addVoucher: async (data) => {
    const user = await getUserStorage();

    if (!user || !user.id_evento) {
      console.error("Tentativa de salvar voucher sem usuário logado");
      return;
    }

    const dataVoucher: VouchersStorage = {
      id_evento: user.id_evento,
      id_dispositivo: user.id_dispositivo, // Antigo numeroMaquina
      id_produto: data.id_produto!,
      codigo_voucher: data.codigo_voucher!,
      sync: false, // Nasce desincronizado
      data: currentDateTimeDB()
    };

    const currentVouchers = get().vouchers;
    const newVouchersList = [dataVoucher, ...currentVouchers];

    // Salva no Zustand e no Storage
    set({ vouchers: newVouchersList });
    await setVoucherStorage(newVouchersList);

    get().sendStorageData();
  },

  // 3. Envia dados pendentes para o servidor (Upload)
  sendStorageData: async () => {
    // 1. Pega estado atual
    const allVouchers = get().vouchers;

    // 2. Filtra quem precisa subir (sync: false)
    const unsynced = allVouchers.filter(v => v.sync === false);

    if (unsynced.length === 0) return;

    if (await hasNetwork()) {
      try {
        const user = await getUserStorage();
        if (!user || !user.id_evento) return;

        // Envia para o PHP
        const response = await apiQrCode.syncVouchers(user.id_evento, unsynced);

        // Verifica se deu sucesso E se veio a lista de códigos confirmados
        if (response.status === 'success' && Array.isArray(response.inserted_codes)) {

          const confirmedCodes = response.inserted_codes;

          // 3. Atualiza APENAS os vouchers que o servidor confirmou que salvou
          const updatedVouchers = allVouchers.map(v => {
            // Se o código deste voucher está na lista de confirmados, marca sync = true
            if (confirmedCodes.includes(v.codigo_voucher)) {
              return { ...v, sync: true };
            }
            // Se não está na lista (mesmo que tenha sido enviado), mantém sync = false
            return v;
          });

          // 4. Salva o novo estado
          set({ vouchers: updatedVouchers });
          await setVoucherStorage(updatedVouchers);

          console.log(`Sincronização: ${confirmedCodes.length} vouchers confirmados.`);

          if (confirmedCodes.length < unsynced.length) {
            console.warn("Atenção: Alguns vouchers não foram salvos pelo servidor.");
          }

        } else {
          console.warn("API retornou erro ou formato inválido", response);
        }
      } catch (error) {
        console.error("Erro ao enviar dados offline:", error);
      }
    }
  },

  verifyAsyncData: async () => {
    await get().sendStorageData();
  },

  // 5. Baixa histórico do servidor (Download / Full Sync)
  // Útil se o usuário trocou de celular ou limpou dados, mas quer ver o histórico
  sync: async () => {
    if (!(await hasNetwork())) return;

    try {
      const user = await getUserStorage();
      if (!user || !user.id_evento || !user.id_dispositivo) return;

      // 1. Busca dados do servidor
      const serverData = await apiQrCode.getVouchers(user.id_evento, user.id_dispositivo);

      if (!serverData || !serverData.data || serverData.status === 'error') return;

      // 2. Pega os locais que AINDA não subiram (para não perder o que foi feito offline agora)
      const localUnsynced = get().vouchers.filter(v => v.sync === false);

      // 3. Converte dados do servidor para formato VouchersStorage e marca sync=true
      const serverVouchersFormatted: VouchersStorage[] = serverData.data.map((item: any) => ({
        id_evento: item.id_evento,
        id_dispositivo: item.id_dispositivo,
        id_produto: item.id_produto,
        codigo_voucher: item.codigo_voucher || item.codigo,
        data: item.data,
        sync: true // Vindo do servidor, já está sincronizado
      }));

      // 4. Mescla: Locais não sincronizados + Dados do servidor
      // Colocamos os locais primeiro (mais recentes/pendentes)
      const mergedList = [...localUnsynced, ...serverVouchersFormatted];

      // Remove duplicatas baseadas no codigo_voucher (segurança extra)
      const uniqueList = Array.from(new Map(mergedList.map(item => [item.codigo_voucher, item])).values());

      await setVoucherStorage(uniqueList);
      set({ vouchers: uniqueList });
    } catch (error) {
      console.error("Erro no sync full:", error);
      Alert.alert("Erro", "Falha ao sincronizar histórico.");
    }
  }
}));