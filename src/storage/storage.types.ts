export type UserStorage = {
  user_id: number | null
  id_evento: number | null;
  id_dispositivo: number | null
  nome_evento: string | null
  data_evento: string | null
}

export type ProdutosStorage = {
  id: number;
  nome: string;
  valor: string;
  quantidade: number;
  impressoes: number | null
}

export type VouchersStorage = {
  id?: number
  id_evento: number
  id_dispositivo: number | null
  id_produto: number
  codigo_voucher: string
  sync?: boolean
  data?: string
}