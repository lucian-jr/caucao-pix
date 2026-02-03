import AsyncStorage from '@react-native-async-storage/async-storage'

const useAsyncStorage = () => {
  const setItem = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Erro ao definir item no AsyncStorage:', error)
    }
  }

  const getItem = async <T>(key: string): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value !== null) {
        return JSON.parse(value)
      }
      return null
    } catch (error) {
      console.error('Erro ao obter item do AsyncStorage:', error)
      return null
    }
  }

  const removeItem = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error('Erro ao remover item do AsyncStorage:', error)
    }
  }

  return {
    setItem,
    getItem,
    removeItem,
  }
}

export { useAsyncStorage }
