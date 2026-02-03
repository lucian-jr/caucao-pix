import { create } from "zustand"

import { useAsyncStorage } from "../hooks"
import { apiQrCode } from "../services/api"

import type { UserStorage, VouchersStorage } from "../storage/storage.types"
import { hasNetwork } from "../utils/net"
import { Alert } from "react-native"
import { Float } from "react-native/Libraries/Types/CodegenTypes"
import { currentDateTimeDB } from "../utils/date.utils"
import { getVoucherStorage } from "../storage/storage"

interface syncQrCodesResponseData {
  status: 'success' | 'error';
  message: string;
}

type VouchersState = {
  vouchers: VouchersStorage[]
  addVoucher: (data: VouchersStorage) => Promise<void>
  sendStorageData: () => Promise<void>
  verifyAsyncData: () => Promise<void>
  sync: () => Promise<syncQrCodesResponseData>
}

export const useQrCodeStore = create<VouchersState>((set, get) => ({
  vouchers: [],
  addVoucher: async (data: VouchersStorage): Promise<void> => {
    const { setItem, getItem } = useAsyncStorage();
    const storedUser: UserStorage | null = await getItem('user');

    if (!storedUser) return;

    const storageVouchers = await getVoucherStorage() || [];
    const dataVoucher = {
      id_evento:        data.id_evento,
      id_dispositivo:   data.id_dispositivo,
      id_produto:       data.id_produto,
      codigo_voucher:   data.codigo_voucher,
      sync:             false,
      data:             currentDateTimeDB()
    };
    // console.log(dataVoucher)

    const newVoucher = [dataVoucher, ...storageVouchers];
    console.log('Vouchers storage',  newVoucher)
    await setItem('vouchers', newVoucher);

    set(() => ({ vouchers: newVoucher }));
  },
  sendStorageData: async () => {
    const event = await getEventStorage()
    const unSyncQrodes = await getQrCodesStorage() || [];
    let filteredQrcodes = [];

    if (!event || !unSyncQrodes.length) return;

    if (await hasNetwork()) {
      const { setItem, removeItem } = useAsyncStorage()

      for (const qrCode of unSyncQrodes) {
        if (!qrCode.sync) {
          filteredQrcodes.push({
            id_evento: qrCode.id_evento,
            codigo: qrCode.codigo,
            quantidade: qrCode.quantidade ? qrCode.quantidade : 0,
            id_impressora: qrCode.id_impressora,
            situacao: qrCode.situacao,
            data: qrCode.data,
            ...(qrCode.produtos && { produtos: qrCode.produtos }),
          });
        }
      }

      // console.log('filteredQrcodes antes', filteredQrcodes)

      if (filteredQrcodes.length) {
        const sentData = await apiQrCode.syncQrCode(event.id, filteredQrcodes);
        const { status, inserted_codes } = sentData

        const notInsertedCodes = filteredQrcodes.filter(item =>
          !inserted_codes.includes(item.codigo)
        ); // Verifica se todos os codigos que estavam no local foram inseridos 

        // console.log('inserted_codes', inserted_codes);
        // console.log('notInsertedCodes', notInsertedCodes);        

        if (Array.isArray(notInsertedCodes) && notInsertedCodes.length > 0) {

          removeItem('qrCodes')
          setItem('qrCodes', notInsertedCodes);

          Alert.alert(
            'Houve um problema!',
            'Tivemos um problema ao enviar alguns QR Codes ao servidor, por favor tente novamente!',
            [
              {
                text: 'Entendi'
              },
            ],
            { cancelable: false }
          );

        } else if (status === 'success') {
          removeItem('qrCodes')
        } else {
          Alert.alert(
            'Houve um problema!',
            'Tivemos um problema ao enviar os Qr Codes ao servidor, por favor tente novamente!',
            [
              {
                text: 'Entendi'
              },
            ],
            { cancelable: false }
          );
        }
      }

      await get().sync()
    }
  },
  verifyAsyncData: async () => {
    const event = await getEventStorage()
    const unSyncQrodes = await getQrCodesStorage() || [];

    if (!event || !unSyncQrodes.length) return;

  },
  sync: async (): Promise<syncQrCodesResponseData> => {
    const event = await getEventStorage();
    const { getItem, setItem } = useAsyncStorage();
    const storedUser: UserStorage | null = await getItem('user');

    if (!storedUser || !event) {
      return { status: 'error', message: 'Usuário ou evento não encontrado. (error: qrCodesStore/244)' };
    }

    const id_impressora = storedUser.id_impressora;

    if (await hasNetwork()) {
      let dbQrCodes = await apiQrCode.getQrcodes(event.id, id_impressora);

      const unSyncQrodes = (await getQrCodesStorage() || []).filter(({ sync, situacao }) => !sync);
      const qrCodesProductsValue = await apiQrCode.getQrcodesProductsValue(event.id, id_impressora);

      if (dbQrCodes.status == 'error') {
        return { status: 'error', message: 'Ocorreu um erro na consulta dos seus dados. Por favor tente novamente! (error: qrCodesStore/198)' };
      };

      let totalProductsUsedValue: number;
      let unSyncProductsValue: Float = 0;

      const nonSyncQrcodes = unSyncQrodes.filter(({ situacao }) => situacao !== 'cancelado');

      nonSyncQrcodes.forEach((qrCode) => {
        const produtos = qrCode.produtos;

        if (produtos) {
          Object.entries(produtos).forEach(([id_arte, { quantidade, valor }]) => {
            const quantidadeNumerica = parseInt(quantidade, 10);

            if (!isNaN(quantidadeNumerica)) {
              unSyncProductsValue += quantidadeNumerica * valor;
            }
          });
        }
      });

      const additionalValue = parseFloat(qrCodesProductsValue[0].valor); // já é um número

      totalProductsUsedValue = unSyncProductsValue + additionalValue;

      if (qrCodesProductsValue) {
        await setItem('usedMoney', totalProductsUsedValue);
        set(() => ({ usedMoney: totalProductsUsedValue }));
      }

      const newQrCode: QrCodeStorage[] = [];

      for (const item of dbQrCodes.data) {
        newQrCode.push({
          id_evento: item.id_evento,
          codigo: item.codigo,
          quantidade: item.quantidade,
          id_impressora: item.id_impressora,
          data: item.data,
          situacao: item.situacao,
          produtos: item.produtos,
          sync: true
        });
      }

      for (const qrCode of unSyncQrodes) {
        newQrCode.unshift(qrCode)
      }

      await setItem('qrCodes', newQrCode);

      set(() => ({ qrCodes: newQrCode }));
    } else {
      const stQrCodes = await getQrCodesStorage();

      set(() => ({ qrCodes: stQrCodes }));
    }

    return { status: 'success', message: 'Sincronização concluída com sucesso.' };
  }
}))