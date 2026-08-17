export interface VoucherRedemptionsProgress {
  used: number;
  limit: number;
  remaining: number;
  /** 0–100, clamped for the meter fill. */
  percentage: number;
  isExhausted: boolean;
}

/** Derive progress values for a voucher with a total usage limit. */
export const getVoucherRedemptionsProgress = ({
  used,
  usageLimit,
}: {
  used: number;
  usageLimit: number;
}): VoucherRedemptionsProgress => {
  const safeUsed = Math.max(0, used);
  const safeLimit = Math.max(0, usageLimit);
  const remaining = Math.max(0, safeLimit - safeUsed);
  const percentage = safeLimit <= 0 ? 100 : Math.min(100, Math.round((safeUsed / safeLimit) * 100));

  return {
    used: safeUsed,
    limit: safeLimit,
    remaining,
    percentage,
    isExhausted: remaining === 0 && safeLimit > 0,
  };
};
