import * as MediaLibrary from 'expo-media-library'

type GetPermissionArg = 'MediaLibrary'

export const getPermission = async (arg: GetPermissionArg) => {
  if (arg === 'MediaLibrary') {
    const { status } = await MediaLibrary.requestPermissionsAsync()

    const ok = status === 'granted'

    return ok
  }

  return false
}