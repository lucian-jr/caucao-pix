import { ReactNode, useState } from 'react'
import { View, ScrollView, StatusBar, Text } from "react-native"
import { SyncButton } from "./syncButton/SyncButton"
import { LogOutButton } from "./logoutButton/LogoutButton"
import { styles } from './styles'

import Logo from '../../../assets/images/logo-black.svg'
import Spinner from "react-native-loading-spinner-overlay";

type LayoutProps = {
  children: ReactNode
  onLogoPress?: () => void
}

const Layout = ({ children, onLogoPress }: LayoutProps) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncingChange = (syncing: boolean) => {
    setIsSyncing(syncing);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StatusBar backgroundColor="#F68C51" />

        <View style={styles.headerContent}>
          <Logo width={60} style={{ marginLeft: -5}} onPress={() => onLogoPress?.()} />

          <View style={styles.btnsContainer}>
            <SyncButton onSyncingChange={handleSyncingChange} />

            <Text style={{fontWeight: 900}}>Impressão teste</Text>

            <LogOutButton />
          </View>
        </View>
      </View>

      <ScrollView>
        <View style={styles.content}>
          {children}
        </View>
      </ScrollView>

      <Spinner
        visible={isSyncing}
        textContent={'Aguarde, sincronizando...'}
        textStyle={{ color: '#000' }}
        overlayColor='#000000b8'
      />
    </View>
  )
}

export { Layout }