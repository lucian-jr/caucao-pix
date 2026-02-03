import { useEffect } from "react";
import { Slot, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";

import { 
  useFonts, 
  Roboto_400Regular, 
  Roboto_700Bold 
} from '@expo-google-fonts/roboto';
import * as SplashScreen from 'expo-splash-screen';

import { Layout as CustomLayout } from "@/src/components/layout/Layout"; 

function InitialLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const inAuthGroup = segments[0] === "login";

  useEffect(() => {
    if (!navigationState?.key) return;
    if (isLoading) return;

    if (!user && !inAuthGroup) {
      router.replace("/login");
    } else if (user && inAuthGroup) {
      router.replace("/");
    }
  }, [user, isLoading, segments, navigationState?.key]);

  // --- MUDANÇA AQUI ---

  // 1. Se o sistema ainda não estiver pronto ou carregando, não renderiza nada ou um Loading
  if (!navigationState?.key || isLoading) {
      return <Slot />; 
  }

  // 2. Se estiver na tela de Login, retorna APENAS o Slot (sem Header)
  if (inAuthGroup) {
      return <Slot />;
  }

  // 3. Se estiver logado (Home, etc), retorna o Slot DENTRO do seu Layout personalizado
  return (
    <CustomLayout>
       <Slot /> 
    </CustomLayout>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider showAlert={() => {}}>
      <InitialLayout />
    </AuthProvider>
  );
}