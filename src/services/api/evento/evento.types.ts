export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  status: 'success' | 'error';
  message: string;
  id_evento: number | null;
  id_dispositivo: number | null
}

export type lastedAppVersionResponse = {
  status: 'success' | 'error';
  http_code: number;
  message: string;
  version: string
}