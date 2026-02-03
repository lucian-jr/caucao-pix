import { useEffect, useState } from "react";
import { apiProdutos } from "../services/api";
import { useAsyncStorage } from "./useAsyncStorage";
import { hasNetwork } from "../utils/net"

import type { UserStorage, ProdutosStorage } from "../storage/storage.types";

const useHome = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [produtos, setProdutos] = useState<ProdutosStorage[]>([])

    const { getItem, setItem } = useAsyncStorage();

    const printQrCode = () => {

    }

    useEffect(() => {
        const get_produtos = async () => {
            const user: UserStorage | null = await getItem('user');

            if (!user || user.user_id === null || user.id_dispositivo === null) {
                console.log('ERROR: Não foi encontrado registro de user no sistema.')
                return;
            }

            if (await hasNetwork()) {
                const response = await apiProdutos.getProdutos(user.user_id, user.id_dispositivo) as ProdutosStorage[]; // get produtos 

                console.log("produtos", response)

                setProdutos(response)
                await setItem('produtos', response);
            }
        }

        get_produtos();
    }, []);

    return {
        produtos,
        setProdutos,
        printQrCode
    }
}

export { useHome }