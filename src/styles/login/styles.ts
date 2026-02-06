import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');
const boxSize = width * 0.6; // 60% da largura da tela, ajuste conforme necessário

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35, // Diminuído para melhorar o espaçamento geral
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 900,
    fontSize: 24
  },
  login: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  logo: {
    marginBottom: 0,
    width: 100
  },
  orText: {
    color: '#000',
    marginVertical: 10,
    fontSize: 18
  },
  loginQrcode: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  downloadButton: {
    marginTop: 0,
    alignSelf: 'center',
    paddingVertical: 5,
  },
  underlineText: {
    color: '#000',
    textDecorationLine: 'underline',
    fontSize: 14,
    fontWeight: '300',
    flexDirection: 'row',
    alignItems: 'center',
  },
  aroundCam: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height + 60,
  },
  camera: {
    height: '100%',
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  topOverlay: {
    top: 0,
    left: 0,
    right: 0,
    height: (height - boxSize) / 2,
  },
  bottomOverlay: {
    bottom: 0,
    left: 0,
    right: 0,
    height: (height + 120 - boxSize) / 2,
  },
  leftOverlay: {
    top: (height - boxSize) / 2,
    left: 0,
    width: (width - boxSize) / 2,
    height: boxSize,
  },
  rightOverlay: {
    top: (height - boxSize) / 2,
    right: 0,
    width: (width - boxSize) / 2,
    height: boxSize,
  },
  floatButtons: {
    position: 'absolute',
    left: 0,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    top: height - 150
  },
  scanQrCodeButton: {
    backgroundColor: '#40c982',
    height: 47,
    width: 220,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 12
  },
  cancelQrCodeButton: {
    height: 45,
    width: 220,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 12
  },
  cancelQrCodeText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  }
});
