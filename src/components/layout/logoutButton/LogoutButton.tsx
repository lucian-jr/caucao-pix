import { TouchableOpacity, View, Text } from "react-native"

import { useAuth } from "@/src/context/AuthContext"; 
import Ionicons from '@expo/vector-icons/Ionicons';

const LogOutButton = () => {
  const { logout } = useAuth();

  return (
    <TouchableOpacity onPress={() => logout('')}>
        <View>
          <Text style={{fontWeight: 900}}>Sair</Text>
        </View>
    </TouchableOpacity>
  )
}

export { LogOutButton }