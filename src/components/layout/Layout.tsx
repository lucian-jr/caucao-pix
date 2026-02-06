import React, { ReactNode, useState } from 'react';
import {
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { LogOutButton } from "./logoutButton/LogoutButton";
import { styles as layoutStyles } from './styles'; // Seus estilos originais
import { SyncButton } from "./syncButton/SyncButton";

import Spinner from "react-native-loading-spinner-overlay";
import Logo from '../../../assets/images/logo-black.svg';
import { CustomAlert } from '../customAlert/CustomAlert';

type LayoutProps = {
  children: ReactNode
  onLogoPress?: () => void
}

const Layout = ({ children, onLogoPress }: LayoutProps) => {
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Novos estados para controlar a visibilidade
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isHelpVisible, setHelpVisible] = useState(false);

  const handleSyncingChange = (syncing: boolean) => {
    setIsSyncing(syncing);
  };

  const handleOpenHelp = () => {
    setMenuVisible(false); // Fecha o menu
    setHelpVisible(true);  // Abre a ajuda
  };

  return (
    <View style={layoutStyles.container}>
      <View style={layoutStyles.header}>
        <StatusBar backgroundColor="#F68C51" />

        <View style={layoutStyles.headerContent}>
          <Logo width={60} style={{ marginLeft: -5}} onPress={() => onLogoPress?.()} />

          <View style={layoutStyles.btnsContainer}>
            <SyncButton onSyncingChange={handleSyncingChange} />

            {/* Substituímos o LogOutButton direto pelo Botão de Menu */}
            <TouchableOpacity 
              onPress={() => setMenuVisible(true)} 
              style={layoutStyles.menuButton}
            >
              <Text style={layoutStyles.menuIconText}>⋮</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* --- MODAL DO MENU (Dropdown) --- */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={layoutStyles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={layoutStyles.menuDropdown}>
            
            {/* Opção Ajuda */}
            <TouchableOpacity 
              style={layoutStyles.menuItem} 
              onPress={handleOpenHelp}
            >
              <Text style={layoutStyles.menuText}>Ajuda</Text>
            </TouchableOpacity>

            <View style={layoutStyles.separator} />

            <View style={layoutStyles.menuItem}>
               <LogOutButton /> 
            </View>

          </View>
        </TouchableOpacity>
      </Modal>

      {/* --- MODAL DE AJUDA (Popup) --- */}
      <CustomAlert 
        visible={isHelpVisible}
        title="Emitiu um voucher do produto errado?"
        message="Sem problemas. Rasgue o voucher ao meio e depois em mais duas partes, para inutilizar o QR Code. Descarte. Em seguida, emita o voucher correto e siga o atendimento normalmente."
        onClose={() => setHelpVisible(false)}
        type="info"
      />

      <ScrollView>
        <View style={layoutStyles.content}>
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

export { Layout };

