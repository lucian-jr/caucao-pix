import axios from 'axios'

import { httpClient } from "../httpClient"
import { LoginRequest, LoginResponse, lastedAppVersionResponse } from "./auth.types"

export const login = async ({ username, password }: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await httpClient.post('auth_login_app?app-mobile=true&v=' + Date.now(), { login: username, senha: password })

    const data: LoginResponse = response.data

    console.log(data)

    return data
  } catch (error) {
    console.log(error, 'login')

    const message = (axios.isAxiosError(error) && error?.response?.data?.message) || 'Houve um problema ao realizar a autênticação.'
    const code = (axios.isAxiosError(error) && error?.response?.status) || 0;

    return {
      status: 'error',
      message: message,
      user_id: null,
      id_evento: null,
      id_dispositivo: null,
      nome_evento: null,
      data_evento: null
    };
  }
}


export const getLastedAppVersion = async (): Promise<lastedAppVersionResponse> => {
  try {
    const response = await httpClient.get('getLastedAppVersion?v=' + Date.now());

    const data: lastedAppVersionResponse = response.data

    return data
  } catch (error) {
    console.log(error, 'getLastedAppVersion')

    const code = (axios.isAxiosError(error) && error?.response?.status) || 0;

    return {
      status: 'error',
      message: 'An error occurred',
      http_code: code,
      version: ''
    };
  }
}