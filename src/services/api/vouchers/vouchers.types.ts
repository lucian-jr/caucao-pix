import { VouchersStorage } from "@/src/storage/storage.types";

export type GetVouchersResponse = {
  status: 'success' | 'error';
  message: string;
  http_code: number;
  data: VouchersStorage[] | null;
};

export type PutVouchersResponse = {
  status: 'success' | 'error';
  message: string;
  inserted_codes: string[];
}