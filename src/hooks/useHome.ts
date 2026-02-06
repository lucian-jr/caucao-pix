import { format } from 'date-fns';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { stringMd5 } from 'react-native-quick-md5';
import ViewShot from 'react-native-view-shot';

// Hooks e Contextos
import { useAuth } from "@/src/context/AuthContext";
import useCaptureAndPrint from '@/src/hooks/useCaptureAndPrint';
import { useVouchersStore } from "@/src/stores/vouchersStore";

// Utils e Services
import { valorFormatado } from "@/src/utils/value.utils";
import { apiProdutos } from "../services/api";
import { hasNetwork } from "../utils/net";

// Storage
import {
    getProductsStorage,
    getUserStorage,
    getVoucherStorage,
    setProductsStorage
} from "../storage/storage";
import type { ProdutosStorage } from "../storage/storage.types";

export const useHome = (viewShotRef: React.RefObject<ViewShot>) => {
    // Estados de Dados
    const [produtos, setProdutos] = useState<ProdutosStorage[]>([]);

    // Estados de Controle Visual
    const [isLoadingData, setIsLoadingData] = useState(false); // Loading da lista
    const [printData, setPrintData] = useState<any>(null);     // Dados para o layout oculto
    const [printingId, setPrintingId] = useState<number | string | null>(null); // Qual item está imprimindo

    // Hooks Internos
    const { user } = useAuth();
    const addVoucherToStore = useVouchersStore(state => state.addVoucher);
    const { captureAndPrint, loading: isPrinting } = useCaptureAndPrint();

    // --- 1. Lógica de Carregar Produtos (Híbrida) ---
    const fetchProdutos = useCallback(async () => {
        setIsLoadingData(true);
        try {
            // A. Carrega local (Offline first)
            const localProdutos = await getProductsStorage();
            if (localProdutos && localProdutos.length > 0) {
                setProdutos(localProdutos);
            }

            // B. Atualiza via API se tiver rede
            if (await hasNetwork()) {
                const storedUser = await getUserStorage();
                if (!storedUser?.id_evento || !storedUser?.id_dispositivo) return;

                const apiResponse = await apiProdutos.getProdutos(storedUser.id_evento, storedUser.id_dispositivo) as ProdutosStorage[];

                console.log("produtos", apiResponse)

                if (apiResponse && apiResponse.length > 0) {

                    // 1. Pegamos TODOS os vouchers que estão salvos no celular (Histórico)
                    const vouchersSalvos = await getVoucherStorage();

                    // 2. Contamos manualmente: Quantos vouchers existem para cada ID de produto?
                    const contagem: Record<string, number> = {};
                    vouchersSalvos.forEach(v => {
                        const id = String(v.id_produto);
                        contagem[id] = (contagem[id] || 0) + 1;
                    });

                    // 3. Aplicamos essa contagem nos produtos que vieram da API
                    const produtosMesclados = apiResponse.map((prodApi) => {
                        const id = String(prodApi.id);
                        return {
                            ...prodApi, // Atualiza nome/preço
                            impressoes: contagem[id] || 0 // Usa a contagem REAL do histórico
                        };
                    });

                    setProdutos(produtosMesclados);
                    await setProductsStorage(produtosMesclados);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        } finally {
            setIsLoadingData(false);
        }
    }, []);

    // Carrega sempre que a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            fetchProdutos();
        }, [])
    );

    // --- 2. Auxiliares ---
    const generateVoucherCode = (): string => {
        const now = Date.now();

        const msec = now * 1000;
        const uniqPart = msec.toString(16);

        const timestampNs = now * 1000000;
        const timestampMd5 = stringMd5(timestampNs.toString());

        return `${uniqPart}${timestampMd5}`;
    };

    // --- 3. Ação de Imprimir ---
    const handlePrintItem = async (item: ProdutosStorage) => {
        if (!user || !user.id_evento) {
            Alert.alert("Erro", "Usuário ou evento não identificados.");
            return;
        }

        // Marca qual botão vai girar o loading
        setPrintingId(item.id);

        try {
            // Gera códigos
            const uniqueCode = generateVoucherCode();
            const dateTime = new Date();

            // Prepara dados para o Layout Oculto
            const dataToPrint = {
                nomeProduto: item.nome,
                valorFormatado: valorFormatado(item.valor),
                codigo: uniqueCode,
                dataHora: format(dateTime, 'dd/MM/yyyy HH:mm:ss'),
                numeroMaquina: user.id_dispositivo || 0,
                eventoId: user.id_evento,
                eventoNome: user.nome_evento,
                eventoData: user.data_evento
            };

            // Atualiza contagem local
            const novosProdutos = produtos.map((prod) => {
                if (prod.id === item.id) {
                    return { ...prod, impressoes: (prod.impressoes || 0) + 1 };
                }
                return prod;
            });

            // Salva Voucher na Store e Produtos no Storage
            await addVoucherToStore({
                id_evento: user.id_evento,
                id_dispositivo: user.id_dispositivo,
                codigo_voucher: uniqueCode,
                id_produto: item.id,
                sync: false,
                data: format(dateTime, 'dd/MM/yyyy HH:mm:ss'),
            });

            setProdutos(novosProdutos);
            await setProductsStorage(novosProdutos);

            // Dispara a renderização do layout oculto
            setPrintData(dataToPrint);

        } catch (error) {
            Alert.alert("Erro", "Falha ao processar impressão.");
            setPrintingId(null); // Reseta loading em caso de erro
        }
    };

    const handleTestPrintItem = async (item: ProdutosStorage) => {
        if (!user || !user.id_evento) {
            Alert.alert("Erro", "Usuário ou evento não identificados.");
            return;
        }

        const uniqueCode = generateVoucherCode();
        const dateTime = new Date();

        // Prepara dados para o Layout Oculto
        const dataToPrint = {
            nomeProduto: item.nome,
            valorFormatado: valorFormatado(item.valor),
            codigo: uniqueCode,
            dataHora: format(dateTime, 'dd/MM/yyyy HH:mm:ss'),
            numeroMaquina: user.id_dispositivo || 0,
            eventoId: user.id_evento,
            eventoNome: user.nome_evento,
            eventoData: user.data_evento
        };

        setPrintData(dataToPrint);
    }

    // --- 4. Monitora o Layout Oculto para capturar a imagem ---
    useEffect(() => {
        if (printData && viewShotRef.current) {
            // Pequeno delay para o React renderizar o texto novo no ViewShot
            const timer = setTimeout(async () => {
                await captureAndPrint(viewShotRef);
                setPrintData(null); // Limpa layout
                setPrintingId(null); // Para o loading do botão
            }, 250);

            return () => clearTimeout(timer);
        }
    }, [printData]);

    return {
        produtos,
        isLoadingData,
        isPrinting,     // Status global de impressão
        printingId,     // ID do item sendo impresso agora
        printData,      // Dados para passar pro componente visual
        handlePrintItem,
        handleTestPrintItem,
        refreshProdutos: fetchProdutos
    };
};