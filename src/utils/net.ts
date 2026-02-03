import NetInfo from '@react-native-community/netinfo'

export const hasNetwork = async (): Promise<boolean> => {
  const response = await NetInfo.fetch()

  const ok = !!response.isConnected

  return ok
}