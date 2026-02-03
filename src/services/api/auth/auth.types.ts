export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  status: 'success' | 'error';
  message: string;
  user_id: number | null
  id_evento: number | null;
  id_dispositivo: number | null
  nome_evento: string | null
  data_evento: string | null
}

export type lastedAppVersionResponse = {
  status: 'success' | 'error';
  http_code: number;
  message: string;
  version: string
}