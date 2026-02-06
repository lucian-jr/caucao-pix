import { Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/src/context/AuthContext";

const LogOutButton = () => {
  const { logout } = useAuth();

  return (
    <TouchableOpacity onPress={() => logout('soft')}>
        <View>
          <Text style={{fontWeight: 900}}>Sair</Text>
        </View>
    </TouchableOpacity>
  )
}

export { LogOutButton };

