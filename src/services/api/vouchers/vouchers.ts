import axios from 'axios';
import { httpClient } from "../httpClient";

import { VouchersStorage } from '@/src/storage/storage.types';
import type { GetVouchersResponse, PutVouchersResponse } from "./vouchers.types";

export const syncVouchers = async (id_evento: number, vouchers: VouchersStorage[]): Promise<PutVouchersResponse> => {
  const formData = new FormData();

  formData.append('id_evento', id_evento.toString());
  formData.append('vouchers', JSON.stringify(vouchers));

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };

  try {
    const response = await httpClient.post('sync_vouchers_app_mobile?v=' + Date.now(), formData, config);
   
    const data: PutVouchersResponse = response.data
    // console.log('response', data.status)
    return data;
  } catch (error) {
    console.log(error, 'sync_vouchers_app_mobile')

    const code = (axios.isAxiosError(error) && error?.response?.status) || 0;

    return {
      status: 'error',
      message: 'An error occurred',
      inserted_codes: []
    };
  }
}

export const getVouchers = async (id_evento: number, id_dispositivo: number): Promise<GetVouchersResponse> => {
  try {
    const response = await httpClient.get('get_vouchers_app_mobile/' + id_evento + '/' + id_dispositivo + '?v=' + Date.now())

    const data: GetVouchersResponse = response.data
    // console.log('getVouchers', data)
    return data
  } catch (error) {
    console.log(error, 'getVouchers')

    const code = (axios.isAxiosError(error) && error?.response?.status) || 0;

    return {
      status: 'error',
      message: 'An error occurred',
      http_code: code,
      data: []
    };
  }
}