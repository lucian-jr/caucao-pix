import { Animated, TouchableOpacity, View, Text} from "react-native"
import { useSyncButton } from "./hooks/useSyncButton"
import { useInterval } from "@/src/hooks"
import { styles } from "./styles"

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons'
import { hasNetwork } from "@/src/utils/net"
import { useEffect } from "react"

interface SyncButtonProps {
  onSyncingChange?: (isSyncing: boolean) => void;
}

const SyncButton = ({onSyncingChange} : SyncButtonProps) => {
  const { 
    hasSync, 
    isSyncing, 
    rotate, 
    sync,
  } = useSyncButton()

  useEffect(() => {
    if (onSyncingChange) {
      onSyncingChange(isSyncing);
    }
  }, [isSyncing, onSyncingChange]);
  
  // useInterval(async () => {
  //   const isConnected = await hasNetwork();
  //   if (isConnected) {
  //     sync();
  //   }
  // }, 900000);

  return (
    <TouchableOpacity style={styles.container} onPress={sync}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <MaterialIcons name="loop" size={24} color="black" />
      </Animated.View>
      {(hasSync && !isSyncing) && <FontAwesome5 name="exclamation-circle" size={16} color="orange" style={styles.refreshIcon} />}
      {(!hasSync && !isSyncing) && (
        <>
          <View style={styles.insideCheckIcon} />
          <MaterialIcons name="check-circle" size={18} color="#16a34a" style={styles.refreshIcon} />
        </>
      )}
    </TouchableOpacity>
  )
}

export { SyncButton }
