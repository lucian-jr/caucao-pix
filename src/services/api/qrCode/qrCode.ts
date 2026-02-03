import { httpClient } from "../httpClient"
import axios from 'axios'

import type { GetQrCodeResponse, PutQrCodeResponse, GetVendasResponse, GetQrcodesProductsValueResponse, DeleteQrCodeResponse } from "./qrCode.types"

export const syncQrCode = async (id_evento: number, qrCodes: Array<{id_evento: number, codigo: string, quantidade: number, situacao: string, id_impressora?: number, produtos?: object}>): Promise<PutQrCodeResponse> => {
  const formData = new FormData();

  formData.append('id_evento', id_evento.toString());
  formData.append('qrCodes', JSON.stringify(qrCodes));

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };

  try {
    const response = await httpClient.post('syncQrCode?v=' + Date.now(), formData, config);
   
    const data: PutQrCodeResponse = response.data
    // console.log('response', data.status)
    return data;
  } catch (error) {
    console.log(error, 'syncQrCode')

    const code = (axios.isAxiosError(error) && error?.response?.status) || 0;

    return {
      status: 'error',
      message: 'An error occurred',
      http_code: code,
      inserted_codes: []
    };
  }
}
export const getQrcodes = async (id_evento: number, id_impressora: number): Promise<GetQrCodeResponse> => {
  try {
    const response = await httpClient.get('getQrcodes/' + id_evento + '/' + id_impressora + '?v=' + Date.now())

    const data: GetQrCodeResponse = response.data
    // console.log('qrcodes', data)
    return data
  } catch (error) {
    console.log(error, 'getQrcodes')

    const code = (axios.isAxiosError(error) && error?.response?.status) || 0;

    return {
      status: 'error',
      message: 'An error occurred',
      http_code: code,
      data: []
    };
  }
}

export const cancelQrCode = async (codigo: string): Promise<DeleteQrCodeResponse> => {
  try {
    const response = await httpClient.get('cancelQrCode/' + codigo + '?v=' + Date.now())

    const data: DeleteQrCodeResponse = response.data

    return data
  } catch (error) {
    console.log(error, 'cancelQrCode')

    return []
  }
}

export const getVenda = async (id_evento: number, codigo_produto: string): Promise<GetVendasResponse> => {
  try {
    const response = await httpClient.get('getVenda/' + id_evento + '/' + codigo_produto + '?v=' + Date.now())

    const data: GetVendasResponse = response.data
    
    return data
  } catch (error) {
    console.log(error, 'getVenda')

    return []
  }
}

export const getQrcodesProductsValue = async (id_evento: number, id_impressora: number): Promise<GetQrcodesProductsValueResponse> => {
  try {
    const response = await httpClient.get('getQrcodesProductsValue/' + id_evento + '/' + id_impressora + '?v=' + Date.now())

    const data: GetQrcodesProductsValueResponse = response.data
    
    return data
  } catch (error) {
    console.log(error, 'getQrcodesProductsValue')

    return [];
  }
}