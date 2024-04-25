import { VoucherCode } from "../VoucherCodesDatagrid/types";

export const hasSavedVoucherCodesToDelete = (
  voucherCodesIdsToDelete: string[],
  voucherCodes: VoucherCode[],
): boolean => {
  return voucherCodesIdsToDelete.some(voucherCodeId => {
    const voucherCode = voucherCodes.find(voucherCode => voucherCode.code === voucherCodeId);

    return voucherCode && voucherCode.status !== "Draft";
  });
};
