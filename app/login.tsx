import { useState } from "react";
import { TextInput, View, Text, TouchableOpacity } from "react-native"

import { useLogin } from "../src/hooks/useLogin"
import { Button } from "../src/components"
import { styles } from "../src/styles/login/styles"
import { CustomAlert } from '../src/components/';
import { MaterialIcons } from '@expo/vector-icons'
import { CameraView } from "expo-camera";

import Logo from '../assets/images/login.svg'


const Login = () => {

  const [showAlert, setShowAlert] = useState(false);

  const {
    isLoading,
    openDownloadLink,
    loginQrCode,
    loginWightQrCode,
    cancelLoginQrCode,
    startScan,
    scanned,
    useScan
  } = useLogin()

  return (
    <View style={styles.container}>
      <CustomAlert 
         visible={showAlert}
         title="Ops!"
         message="Usuário ou senha incorretos."
         confirmText="Tentar Novamente"
         onConfirm={() => setShowAlert(false)}
         // onCancel={() => setShowAlert(false)} // Opcional se quiser botão de cancelar
       />

      <View style={styles.login}>
        <Logo style={styles.logo} />

        <View>
          <Text style={styles.title}>Devolução de caução</Text>
          <Text style={styles.orText}>Entre para devolver a caução de forma rápida e segura</Text>
        </View>

        <Button label="ENTRAR" color="green" onPress={loginQrCode} disabled={isLoading} loading={isLoading} />

        <TouchableOpacity onPress={openDownloadLink} style={styles.downloadButton}>
          <Text style={styles.underlineText}>
            Atualizar APP
          </Text>
        </TouchableOpacity>
      </View>

      {useScan === false &&
        (
          <View style={styles.aroundCam}>
            <CameraView
              onBarcodeScanned={scanned ? undefined : loginWightQrCode}
              barcodeScannerSettings={{
                barcodeTypes: ['qr']
              }}
              style={styles.camera}
            />

            <View style={styles.floatButtons}>
              <TouchableOpacity onPress={startScan} style={styles.scanQrCodeButton}>
                <Text style={styles.cancelQrCodeText}>
                  ESCANEAR
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={cancelLoginQrCode} style={styles.cancelQrCodeButton}>
                <Text style={styles.cancelQrCodeText}>
                  CANCELAR
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.overlay, styles.topOverlay]} />
            <View style={[styles.overlay, styles.bottomOverlay]} />
            <View style={[styles.overlay, styles.leftOverlay]} />
            <View style={[styles.overlay, styles.rightOverlay]} />
          </View>
        )
      }
    </View>
  )
}

export default Login