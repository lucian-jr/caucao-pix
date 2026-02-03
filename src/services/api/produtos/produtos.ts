import axios from 'axios'

import { httpClient } from "../httpClient"
import { ProdutosResponse } from "./produtos.types"

export const getProdutos = async (id_evento: number, id_dispositivo: number): Promise<ProdutosResponse[]> => {
  try {
    const response = await httpClient.get(`get_produtos/${id_evento}/${id_dispositivo}/?app-mobile=true&v=${Date.now()}`);

    const data: ProdutosResponse[] = response.data

    return data
  } catch (error) {
    console.log(error, 'getLastedAppVersion')

    const code = (axios.isAxiosError(error) && error?.response?.status) || 0;

    return []
  }
}