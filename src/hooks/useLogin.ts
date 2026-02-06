import { Camera } from "expo-camera";
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { apiAuth } from '../services/api';
import { useVouchersStore } from '../stores';
import { hasNetwork } from "../utils/net";
import { useAsyncStorage } from './useAsyncStorage';

interface LoginData {
  username: string;
  password: string;
}

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [useScan, setScan] = useState(true);
  const [scanned, setScanned] = useState(true);

  const { setItem } = useAsyncStorage()
  const { login } = useAuth()

  const loadVouchersLocal = useVouchersStore(state => state.loadFromStorage);
  const syncVouchers = useVouchersStore(state => state.sync);

  const openDownloadLink = () => {
    const url = 'https://play.google.com/store/apps/details?id=com.lucian.mcecashless';

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("URL inválida: " + url);
        }
      })
      .catch((err) => console.error("Erro ao abrir o link:", err));
  };

  const loginQrCode = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
    setScan(false)
  }

  const loginWithQrCode = async ({ type, data }: { type: string, data: string }) => {
    setScan(true)
    setScanned(true);

    if (data) {
      try {
        const dataLogin: LoginData = JSON.parse(data);

        if (dataLogin.username && dataLogin.password) {
          setIsLoading(true)

          try {
            const response = await apiAuth.login(dataLogin)

            if (response) {
              // Erro na API (status error)
              if ('message' in response && response.status === "error") {
                setIsLoading(false)
                Alert.alert('Erro', response.message, [{ text: 'Entendi' }])
                return;
              }

              // Resposta sem dados
              if (!response.id_evento) {
                setIsLoading(false)
                Alert.alert('Erro', response.message, [{ text: 'Entendi' }])
                return;
              }

              const { user_id, id_dispositivo, id_evento, nome_evento, data_evento } = response;

              const dataUser = {
                "user_id": user_id,
                "id_dispositivo": id_dispositivo,
                "id_evento": id_evento,
                "nome_evento": nome_evento,
                "data_evento": data_evento,
              }

              await setItem('user', dataUser)

              if (await hasNetwork()) {
                console.log("Baixando histórico de vouchers...");
                
                try {
                  await syncVouchers();
                } catch (err) {
                  console.error("Erro ao baixar histórico:", err);
                }
              }

              await loadVouchersLocal();

              login(dataUser);

              setIsLoading(false);
            }
          } catch (error) {
            setIsLoading(false)
            Alert.alert('Erro', 'Ocorreu um erro inesperado ao fazer login.', [{ text: 'OK' }])
            console.log(error)
          }
        }
      } catch (e) {
        Alert.alert('Erro', 'QR Code inválido.', [{ text: 'OK' }])
      }
    }
  };

  const startScan = async () => {
    setScanned(false);
  };

  const cancelLoginQrCode = () => {
    setScan(true)
    setScanned(true);
  };

  useEffect(() => {
    const checkVersionAndLogin = async () => {
      if (await hasNetwork()) {
        try {
          const response = await apiAuth.getLastedAppVersion();
          const { version } = response;
          const appCurrentVersion = Constants.expoConfig?.version;

          if (version && version !== appCurrentVersion) {
            await setItem('user', '');

            Alert.alert(
              'Atualização disponível!',
              'Uma nova versão do aplicativo está disponível. Por favor, atualize para continuar!',
              [
                { text: 'Atualizar', onPress: () => openDownloadLink() },
              ]
            );
            return;
          }
        } catch (error) {
          console.log('Erro ao checar versão', error)
        }
      } else {
        Alert.alert(
          'Alerta',
          'Você está desconectado da internet. Por favor, verifique sua conexão!',
          [{ text: 'Entendi' }]
        );
      }
    };

    checkVersionAndLogin();
  }, [])

  return {
    isLoading,
    openDownloadLink,
    loginQrCode,
    loginWithQrCode,
    cancelLoginQrCode,
    hasPermission,
    startScan,
    scanned,
    useScan,
  }
}

export { useLogin };

