import { getPromotionStatus, type PromotionStatus } from "./utils";

export type VoucherStatus = PromotionStatus | "usedUp";

/** Whether every use the usage limit allows is taken. No limit (null or empty) means unlimited. */
export const isVoucherUsageLimitReached = ({
  usageLimit,
  used,
}: {
  usageLimit: number | string | null | undefined;
  used: number | null | undefined;
}): boolean => {
  if (usageLimit === null || usageLimit === undefined || usageLimit === "") {
    return false;
  }

  const limit = Number(usageLimit);

  return Number.isFinite(limit) && (used ?? 0) >= limit;
};

/**
 * A voucher's status as the API's status filter sees it. A voucher whose usage limit is used up
 * can't be redeemed, so the API counts it as expired whatever its dates say.
 */
export const getVoucherStatus = ({
  startDate,
  endDate,
  usageLimit,
  used,
  now = new Date(),
}: {
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  usageLimit: number | null | undefined;
  used: number | null | undefined;
  now?: Date;
}): VoucherStatus => {
  const scheduleStatus = getPromotionStatus({ startDate, endDate, now });

  if (scheduleStatus !== "finished" && isVoucherUsageLimitReached({ usageLimit, used })) {
    return "usedUp";
  }

  return scheduleStatus;
};
