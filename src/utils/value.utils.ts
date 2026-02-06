export function valorFormatado(valor: number | string) {
  // 1. Garante que o input seja tratado como número
  let numero = Number(valor);

  // Se o valor for uma string com vírgula (ex: "10,50"), convertemos corretamente
  if (isNaN(numero) && typeof valor === 'string') {
    numero = parseFloat(valor.replace(',', '.'));
  }

  // Se ainda não for número (ex: null, undefined), retorna zero
  if (isNaN(numero)) {
    return 'R$ 0,00';
  }

  // 2. Fixa 2 casas decimais (vira string: "1000.00")
  // 3. Substitui o ponto decimal por vírgula
  // 4. Regex para adicionar o ponto de milhar (Opcional, mas recomendado para BRL)
  return 'R$ ' + numero
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}