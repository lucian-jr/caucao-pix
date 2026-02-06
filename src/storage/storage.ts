import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ProdutosStorage, UserStorage, VouchersStorage } from "./storage.types"; // Importe a tipagem de Produtos

// Chaves
const VOUCHERS_KEY = 'vouchers';
const USER_KEY = 'user';
const PRODUTOS_KEY = 'produtos'; // <--- Nova chave

// --- VOUCHERS ---
export const getVoucherStorage = async (): Promise<VouchersStorage[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(VOUCHERS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Erro ao ler vouchers", e);
    return [];
  }
};

export const setVoucherStorage = async (vouchers: VouchersStorage[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(vouchers);
    await AsyncStorage.setItem(VOUCHERS_KEY, jsonValue);
  } catch (e) {
    console.error("Erro ao salvar vouchers", e);
  }
};

export const clearVoucherStorage = async (): Promise<void> => {
  await AsyncStorage.removeItem(VOUCHERS_KEY);
};

// --- USER ---
export const getUserStorage = async (): Promise<UserStorage | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Erro ao ler usuário", e);
    return null;
  }
};

// --- PRODUTOS (ADICIONADO AGORA) ---
export const getProductsStorage = async (): Promise<ProdutosStorage[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PRODUTOS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Erro ao ler produtos", e);
    return [];
  }
};

export const setProductsStorage = async (produtos: ProdutosStorage[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(produtos);
    await AsyncStorage.setItem(PRODUTOS_KEY, jsonValue);
  } catch (e) {
    console.error("Erro ao salvar produtos", e);
  }
};