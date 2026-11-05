import {
  getVoucherSchedulePhase,
  type VoucherScheduleDateData,
} from "./components/VoucherChannelAvailabilityCard/getVoucherSchedulePhase";
import { getPromotionStatus, getRelativePromotionTimeParts, type PromotionStatus } from "./utils";

export type VoucherStatus = PromotionStatus | "usedUp";

const parseUsageLimit = (usageLimit: number | string | null | undefined): number | null => {
  if (typeof usageLimit === "number") {
    return usageLimit;
  }

  // A limit typed into the form only counts once it is a whole number.
  const text = usageLimit?.trim() ?? "";

  return /^\d+$/.test(text) ? Number(text) : null;
};

/** Whether every use the usage limit allows is taken. No limit means unlimited. */
export const isVoucherUsageLimitReached = ({
  usageLimit,
  used,
}: {
  usageLimit: number | string | null | undefined;
  used: number | null | undefined;
}): boolean => {
  const limit = parseUsageLimit(usageLimit);

  return limit !== null && (used ?? 0) >= limit;
};

/**
 * Matches the API's status filter: a voucher that has started and hasn't ended counts as expired
 * once its usage limit is used up. One that hasn't started yet stays scheduled.
 */
const withUsageLimit = (
  scheduleStatus: PromotionStatus,
  usageLimitReached: boolean,
): VoucherStatus => (scheduleStatus === "active" && usageLimitReached ? "usedUp" : scheduleStatus);

/** A saved voucher's status, for the voucher list and header. */
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
}): VoucherStatus =>
  withUsageLimit(
    getPromotionStatus({ startDate, endDate, now }),
    isVoucherUsageLimitReached({ usageLimit, used }),
  );

/** The same status from the voucher form's schedule fields, for the sidebar cards. */
export const getVoucherFormStatus = ({
  scheduleData,
  usageLimitReached,
  nowMs,
}: {
  scheduleData: VoucherScheduleDateData;
  usageLimitReached: boolean;
  nowMs?: number;
}): VoucherStatus => {
  const phase = getVoucherSchedulePhase(scheduleData, nowMs);

  return withUsageLimit(phase === "ended" ? "finished" : phase, usageLimitReached);
};

/** The "starts in" or "ended" hint. None for a used-up voucher, which stays unusable whatever its dates. */
export const getVoucherStatusTimeParts = ({
  status,
  startDate,
  endDate,
  now,
}: {
  status: VoucherStatus;
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  now?: Date;
}): ReturnType<typeof getRelativePromotionTimeParts> =>
  status === "usedUp" ? null : getRelativePromotionTimeParts({ status, startDate, endDate, now });
