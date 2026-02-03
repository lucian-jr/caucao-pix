import { useAsyncStorage } from "../hooks"
import type { VouchersStorage } from "./storage.types"


export const getVoucherStorage = async () => {
  const { getItem } = useAsyncStorage()

  const qrCodes: VouchersStorage[] = await getItem('vouchers') || []

  return qrCodes
}