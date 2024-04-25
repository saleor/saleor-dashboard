import { v4 as uuidv4 } from "uuid";

import { VoucherCode } from "../VoucherCodesDatagrid/types";

export const generateMultipleIds = (quantity: string, prefix?: string) => {
  return Array.from({ length: Number(quantity) }).map(() => ({
    code: prefix ? `${prefix}-${uuidv4()}` : uuidv4(),
    status: "Draft",
  }));
};

export const voucherCodeExists = (code: string, voucherCodes: VoucherCode[]) => {
  return voucherCodes.some(voucherCode => voucherCode.code === code);
};
