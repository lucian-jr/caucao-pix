import { useState, useRef, useEffect } from "react"
import { Alert, Animated } from "react-native"
import { useAuth } from "@/src/context/AuthContext"

import { useAsyncStorage } from "@/src/hooks"
import { apiAuth } from "@/src/services/api"
import { UserStorage } from "@/src/storage/storage.types"

import {  useQrCodeStore } from "../../../../stores/vouchersStore"
import { hasNetwork } from "@/src/utils/net"

interface LoginRequest {
  username: string;
  password: string;
}

const useSyncButton = () => {
  const [isSyncing, setIsSyncing] = useState(false)

  const [spinAnimation] = useState(new Animated.Value(0))

  const qrCodes = useQrCodeStore(state => state.vouchers)

  let hasSync = !!qrCodes.filter(({ sync }) => !sync).length

  const sendStorageDataQrCodes = useQrCodeStore(state => state.sendStorageData)

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
    // if (isSyncing || !hasSync) return;
    
    if (isSyncing) return;

    anim.start()
    setIsSyncing(true)

    const hasNet = await hasNetwork()

    if (hasNet) {
      await sendStorageDataQrCodes()
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

export { useSyncButton }