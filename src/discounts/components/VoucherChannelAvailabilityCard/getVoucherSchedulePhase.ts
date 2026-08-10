import { joinDateTime } from "@dashboard/misc";

export type VoucherSchedulePhase = "scheduled" | "active" | "ended";

export interface VoucherScheduleDateData {
  startDate: string;
  startTime: string;
  hasEndDate: boolean;
  endDate: string;
  endTime: string;
}

/** Derive voucher redeemability phase from global schedule fields. */
export const getVoucherSchedulePhase = (
  data: VoucherScheduleDateData,
  nowMs: number = Date.now(),
): VoucherSchedulePhase => {
  const startIso = joinDateTime(data.startDate, data.startTime);
  const endIso = data.hasEndDate ? joinDateTime(data.endDate, data.endTime) : null;

  if (startIso) {
    const startMs = Date.parse(startIso);

    if (!Number.isNaN(startMs) && startMs > nowMs) {
      return "scheduled";
    }
  }

  if (endIso) {
    const endMs = Date.parse(endIso);

    if (!Number.isNaN(endMs) && endMs < nowMs) {
      return "ended";
    }
  }

  return "active";
};
