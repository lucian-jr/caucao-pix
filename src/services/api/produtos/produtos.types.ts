export type ProdutosResponse = {
  id: number;
  nome: string;
  valor: string;
  quantidade: number;
  impressoes: number | 0
} | []