import { useRef, useState } from "react";
import { Animated } from "react-native";


import { hasNetwork } from "@/src/utils/net";
import { useVouchersStore } from "../../../../stores/vouchersStore";

interface LoginRequest {
  username: string;
  password: string;
}

const useSyncButton = () => {
  const [isSyncing, setIsSyncing] = useState(false)

  const [spinAnimation] = useState(new Animated.Value(0))

  const vouchers = useVouchersStore(state => state.vouchers)

  let hasSync = !!vouchers.filter(({ sync }) => !sync).length

  const sendStorageDataVouchers = useVouchersStore(state => state.sendStorageData)

  const anim = useRef(Animated.loop(
    Animated.timing(spinAnimation,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }
    )
  )).current

  const sync = async () => { 
    if (isSyncing) return;

    anim.start()
    setIsSyncing(true)

    const hasNet = await hasNetwork()

    if (hasNet) {
      await sendStorageDataVouchers()
    } else {
      alert('Sem conexão com a internet');
    }

    anim.reset()
    setIsSyncing(false)
  }

  const rotate = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg']
  })

  return {
    hasSync,
    isSyncing,
    rotate,
    sync
  }
}

export { useSyncButton };

