import React from "react";
import { Text, View } from "react-native";
import ViewShot from 'react-native-view-shot';
import LogoMceBlack from "../../../assets/images/voucher-logo.svg";
import { formatDBDate } from "../../utils/date.utils";
import { MyQRCode } from "./QrCode";
import { styles } from './styles';

interface PrintData {
  nomeProduto: string;
  valorFormatado: string;    // Antigo valorVoucherCalc
  codigo: string;            // Antigo vouchersData.codigo_voucher
  dataHora: string;          // Antigo formattedDateTime
  numeroMaquina: number;     // Antigo machineNumber
  eventoId?: number;         // Dados do UserStorage
  eventoNome?: string;
  eventoData?: string;
}

interface Props {
  viewShotRef: React.RefObject<ViewShot>;
  data: PrintData | null;
}

const PrintVoucherLayout: React.FC<Props> = ({ viewShotRef, data }) => {

  if (!data) return null;

  return (
    <View>
      <ViewShot ref={viewShotRef} style={{ backgroundColor: 'white', width: '100%', position: 'absolute', top: 10000 }}>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row' }}>
            <LogoMceBlack width={130} height={80} />

            <View style={styles.boxTextValues}>
              <Text style={styles.nomeProduto}>{data.nomeProduto}</Text>
              <Text style={styles.valorProduto}>{data.valorFormatado}</Text>
            </View>

          </View>

          <View style={styles.containerTexts}>
            <Text style={[{ marginBottom: 5 }, styles.textDefault]}>Este cupom vale por 7 dias e ficará disponível em até 24h após a impressão.</Text>
            <Text style={[{ marginBottom: 2 }, styles.textDefault]}>1. Aponte a câmera do seu celular para o QR Code</Text>
            <Text style={[{ marginBottom: 2 }, styles.textDefault]}>2. Acesse o link que aparecer</Text>
            <Text style={[{ marginBottom: 2 }, styles.textDefault]}>3. Preencha seus dados Pix</Text>
            <Text style={[{ marginBottom: 2 }, styles.textDefault]}>4. Receba sua caução!</Text>
          </View>

          <View style={{ width: 320, marginBottom: 5 }}>
            <MyQRCode code={data.codigo} size={235} />
          </View>
          <Text style={styles.codigoQr}>{data.codigo}</Text>

          {/* Dados do Evento e Máquina */}
          <View>
            <View style={styles.ctnData}>
              <View><Text>.</Text></View>
              <View><Text style={styles.data}>{data.dataHora} - {data.numeroMaquina}</Text></View>
              <View><Text>.</Text></View>
            </View>

            {data.eventoId && (
              <View style={styles.ctnEvent}>
                <View><Text>.</Text></View>
                <View><Text style={styles.data}>#{data.eventoId} - {data.eventoNome} ({data.eventoData ? formatDBDate(data.eventoData) : ''})</Text></View>
                <View><Text>.</Text></View>
              </View>
            )}
          </View>

          <Text style={styles.email}>Dúvidas? saceventos@meucopoeco.com.br</Text>
          <Text style={styles.responsabilidade}>Voucher único e de sua responsabilidade</Text>
        </View>
      </ViewShot>
    </View>
  );
};

export { PrintVoucherLayout };

