import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAsyncStorage } from '../hooks';
import { getUserStorage } from '../storage/storage';
import { UserStorage } from '../storage/storage.types';
import { useVouchersStore } from '../stores';

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

  const vouchers = useVouchersStore(state => state.vouchers)
  let hasSync = !!vouchers.filter(({ sync }) => !sync).length

  const { getItem, removeItem, setItem } = useAsyncStorage()

  useEffect(() => {
    async function loadAppSession() {
      try {
        // 1. Busca o usuário no disco
        const storedUser = await getUserStorage();

        if (storedUser) {
          setUser(storedUser);

          await useVouchersStore.getState().loadFromStorage();

          useVouchersStore.getState().sync().catch(err => console.log('Sync Back', err));
        }
      } catch (error) {
        console.log("Erro ao restaurar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAppSession();
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
        "Você precisa se conectar à internet e sincronizar os dados antes de sair...",
        [{ text: "Entendido" }],
        { cancelable: true }
      )
      return;
    } else if (typeLogout == 'hard') {
      await removeItem('user')
      await removeItem('produtos')
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
            await removeItem('produtos')
            await removeItem('vouchers')
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