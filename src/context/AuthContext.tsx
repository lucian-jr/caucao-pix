import { createContext, useState, useContext, useEffect } from 'react'
import { useAsyncStorage } from '../hooks';
import type { ReactNode } from 'react'
import { Alert } from 'react-native'
import { UserStorage } from '../storage/storage.types';
import { useQrCodeStore } from '../stores'

type AuthContextType = {
  user: UserStorage | null;
  isLoading: boolean;
  login: (data: UserStorage) => void;
  logout: (typeLogout: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserStorage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const qrCodes = useQrCodeStore(state => state.vouchers)
  let hasSync = !!qrCodes.filter(({ sync }) => !sync).length

  const { getItem, removeItem, setItem } = useAsyncStorage()

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedUser: UserStorage | null = await getItem('user');
        
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = async (data: UserStorage) => {
    setIsLoading(true);
    setUser(data);
    setIsLoading(false);
  }

  const logout = async (typeLogout: string = 'soft') => {
    if (hasSync && typeLogout == 'soft') {
      Alert.alert(
        "Atenção!",
        "Você precisa sincronizar os dados antes de sair...",
        [{ text: "Entendido" }],
        { cancelable: true }
      )
      return;
    } else if (typeLogout == 'hard') {
      await removeItem('user')
      setUser(null)
      return;
    }

    Alert.alert(
      "Atenção!",
      "Você tem certeza que deseja sair?",
      [
        {
          text: "Sim",
          onPress: async () => {
            await removeItem('user')
            setUser(null)
          },
        },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    )
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}