import { v4 as uuidv4 } from "uuid";

import { VoucherCode } from "../VoucherCodesDatagrid/types";

export const generateDraftVoucherCode = (code: string) => {
  return {
    code,
    status: "Draft",
  };
};

export const generateMultipleVoucherCodes = (quantity: string, prefix?: string) => {
  return Array.from({ length: Number(quantity) }).map(() =>
    generateDraftVoucherCode(prefix ? `${prefix}-${uuidv4()}` : uuidv4()),
  );
};

export const voucherCodeExists = (code: string, voucherCodes: VoucherCode[]) => {
  return voucherCodes.some(voucherCode => voucherCode.code === code);
};
