import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  actBtns: {
    flexDirection: 'row',
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  print: {
    backgroundColor: '#007bff',
    width: 45,
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 20
  },
  newVoucher: {
    backgroundColor: '#28a745',
    width: 45,
    height: 45,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#d1d1d1",
  },
  containerTexts: {
    marginBottom: 10,
    width: 330,
    paddingHorizontal: 14
  },
  head: {
    flex: 1,
    display: 'flex',
    justifyContent: "center",
  },
  title: {
    fontSize: 12,
    width: 150,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 17,
    marginLeft: 10,
    paddingTop: 15
  },
  textDefault: {
    fontSize: 15,
    fontWeight: '500'
  },
  ctnData: {
    width: 350,
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 5
  },
  ctnEvent: {
    width: 350,
    flexDirection: 'row',
    justifyContent: "space-between",
    marginBottom: 5
  },
  data: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold'
  },
  email: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500'
  },
  responsabilidade: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 30,
    fontWeight: '500'
  },
  codigoQr: {
    textAlign: 'center',
    fontSize: 13,
    width: 500,
    fontWeight: 'bold',
    maxWidth: '75%'
  },
  gerarQRcode: {
    color: '#fff',
    backgroundColor: '#475569',
    borderRadius: 5,
    height: 50,
    width: 170
  },
  textButton: {
    color: 'white',
    textAlign: 'center',
    padding: 15,
    fontWeight: "bold"
  },
  inputQuantidade: {
    textAlign: 'center',
    width: 60,
    height: 50,
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 3,
    color: 'black',
    marginHorizontal: 10,
    fontSize: 18
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0)', // Cor semi-transparente
  },
})