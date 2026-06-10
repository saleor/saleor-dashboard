export const VOUCHER_CODE_DRAFT_STATUS = "Draft";

export interface VoucherCode {
  id?: string;
  code: string;
  used?: number;
  status?: string;
  isActive?: boolean;
}
