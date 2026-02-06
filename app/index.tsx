import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ViewShot from 'react-native-view-shot';

import { Button } from "@/src/components/button/Button";
import { PrintVoucherLayout } from "@/src/components/voucher/PrintVoucherLayout";
import { styles } from "../src/styles/home/styles";

// Importe o hook refatorado
import { useHome } from "@/src/hooks/useHome";

export default function Index() {
  const viewShotRef = useRef<ViewShot>(null!);

  const { 
    produtos, 
    handlePrintItem, 
    handleTestPrintItem,
    isPrinting, 
    printingId, 
    printData 
  } = useHome(viewShotRef);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>

      {produtos && produtos.map((item, index) => (
          <View key={index} style={styles.cardProduto}>
            <Text style={styles.title}>{item.nome}</Text>
            <Text style={styles.impressoes}>{item.impressoes || 0} impressos</Text>

            <Button
              // O botão mostra loading apenas se o ID dele for o que está imprimindo
              label={isPrinting && printingId === item.id ? "..." : "IMPRIMIR"}
              color="green"
              onPress={() => handlePrintItem(item)}
              
              // Loading individualizado
              loading={isPrinting && printingId === item.id}
              
              // Trava todos os botões enquanto um imprime
              disabled={isPrinting}
            />
          </View>
        ))
      }

      {/* Componente Oculto de Impressão */}
      <PrintVoucherLayout
        viewShotRef={viewShotRef}
        data={printData}
      />

      <TouchableOpacity onPress={() => handleTestPrintItem(produtos[1])}>
        <Text style={{textDecorationLine: 'underline', marginTop: 20}}>Impressão teste</Text>
      </TouchableOpacity>
    </View>
  );
}