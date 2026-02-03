export const formatTextLenght = (text : string | undefined | null, limit: number) => {
  if(text === undefined || text === null) return;

  const textoLimitado = text.length > limit ? text.substring(0, limit) + '...' : text;

  return textoLimitado;
}

export const getLastChars = (text: string) => {
  const length = text.length;
  return length > 5 ? '...' + text.substring(length - 15) : text;
};