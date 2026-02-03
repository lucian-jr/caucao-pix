import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type QrCodeProps = {
  code : string;
  size ?: number;
}

const MyQRCode = ({code, size}: QrCodeProps) => {

  const qrValue = "www.meucopoeco.com.br/site/resgate_caucao/" + code;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <QRCode
        value={qrValue}
        size={size} // Tamanho do QR code
        color="black" // Cor do QR code
        backgroundColor="white" // Cor do fundo do QR code
      />
    </View>
  );
};

export { MyQRCode }