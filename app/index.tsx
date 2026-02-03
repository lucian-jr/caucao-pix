import { useState, useRef, useEffect } from "react";
import { Text, View, Alert } from "react-native";
import ViewShot from 'react-native-view-shot';
import { stringMd5 } from 'react-native-quick-md5';
import { format } from 'date-fns';

import { useHome } from "@/src/hooks/useHome";
import { useAuth } from "@/src/context/AuthContext";
import { Button } from "@/src/components/button/Button";
import { styles } from "../src/styles/home/styles";

// Importe o componente visual recuperado
import { PrintVoucherLayout } from "@/src/components/voucher/PrintVoucherLayout";
import useCaptureAndPrint from '@/src/hooks/useCaptureAndPrint';
import { useQrCodeStore } from "@/src/stores/vouchersStore";
import { valorFormatado } from "@/src/utils/value.utils";

import { ProdutosStorage } from "@/src/storage/storage.types";
import { useAsyncStorage } from "@/src/hooks/useAsyncStorage";

export default function Index() {
  const { produtos, setProdutos } = useHome();
  const { user } = useAuth();
  const { setItem } = useAsyncStorage();

  const addQrCodeStore = useQrCodeStore(state => state.addVoucher);

  const viewShotRef = useRef<ViewShot>(null!);
  const { captureAndPrint, loading } = useCaptureAndPrint();

  // Estado para armazenar os dados que o layout vai mostrar
  const [printData, setPrintData] = useState<any>(null);

  // Função para gerar ID único (vinda do seu código original)
  const uniqid = (length: number) => {
    let hash = '';
    while (hash.length < length) {
      hash += Math.random().toString(36).substring(2);
    }
    return hash.substring(0, length);
  }

  // --- FUNÇÃO DO CLIQUE ---
  const handlePrintItem = async (item: ProdutosStorage) => {
    if (!user) {
      Alert.alert("Erro", "Usuário não identificado");
      return;
    }

    // 1. Gera dados dinâmicos
    const newTimestamp = Date.now();
    const uniqueCode = uniqid(13) + "-" + stringMd5(newTimestamp.toString());
    const dateTime = new Date();
    const formattedDateTime = format(dateTime, 'dd/MM/yyyy HH:mm:ss');

    // 2. Monta o objeto EXATAMENTE como o Layout espera receber
    const dataToPrint = {
      nomeProduto: item.nome,
      valorFormatado: valorFormatado(item.valor),
      codigo: uniqueCode,
      dataHora: formattedDateTime,
      numeroMaquina: user.id_dispositivo || 0,
      eventoId: user.id_evento,
      eventoNome: user.nome_evento,
      eventoData: user.data_evento
    };

    if (!user || !user.id_evento) {
      Alert.alert("Erro", "Usuário não possui evento vinculado.");
      return;
    }

    const novosProdutos = produtos.map((prod) => {
      if (prod.id === item.id) {
        return {
          ...prod,
          impressoes: (prod.impressoes || 0) + 1
        };
      }
      return prod;
    });

    // 3. Salva no histórico (Store)
    addQrCodeStore({
      id_evento: user.id_evento,
      id_dispositivo: user.id_dispositivo,
      codigo_voucher: uniqueCode,
      id_produto: item.id,
      sync: false
    });

    // 4. Atualiza o visual escondido para renderizar este voucher
    setPrintData(dataToPrint);
    setProdutos(novosProdutos);
    await setItem('produtos', novosProdutos);
    setPrintData(dataToPrint);
  };

  // --- EFEITO MÁGICO ---
  // Assim que o 'printData' muda, ele espera o React desenhar e tira a foto
  useEffect(() => {
    if (printData && viewShotRef.current) {
      // Pequeno delay para garantir que o ViewShot atualizou os textos novos
      const timer = setTimeout(async () => {
        await captureAndPrint(viewShotRef);
        // setPrintData(null); // Opcional: limpa depois de imprimir
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [printData]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>

      {produtos &&
        produtos.map((item, index) => (
          <View key={index} style={styles.cardProduto}>
            <Text style={styles.title}>{item.nome}</Text>
            <Text style={styles.impressoes}>{item.impressoes || 0} impressos</Text>

            <Button
              label={loading ? "..." : "IMPRIMIR"}
              color="green"
              onPress={() => handlePrintItem(item)}
              disabled={loading}
              loading={loading}
            />
          </View>
        ))
      }

      {/* O Componente do Voucher fica aqui, recebendo os dados do state */}
      <PrintVoucherLayout
        viewShotRef={viewShotRef as React.RefObject<ViewShot>}
        data={printData}
      />

    </View>
  );
}