export type GetQrCodeResponse = {
  status: 'success' | 'error';
  message: string;
  http_code: number;
  data: {
    id_evento: number;
    codigo: string;
    quantidade: number;
    id_impressora: number;
    situacao: string;
    data?: string;
    produtos?: {
      [id_arte: number]: {
        quantidade: string;
        valor: number;
      };
    }
  }[];
};

export type DeleteQrCodeResponse  = {
  id_evento: number;
  codigo: string;
  quantidade: number;
  id_impressora: number;
  situacao: string;
  data?: string;
}[]

export type PutQrCodeResponse = {
  status: 'success' | 'error';
  message: string;
  http_code: number;
  inserted_codes: string [];
}

export type GetVendasResponse = {
  id: number
  valor: number
}[]

export type GetQrcodesProductsValueResponse = {
  valor: string
}[]