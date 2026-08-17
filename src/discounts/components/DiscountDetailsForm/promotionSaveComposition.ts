import { type DiscoutFormData } from "@dashboard/discounts/types";

export interface PromotionSaveComposition {
  hasGeneral: boolean;
  hasSchedule: boolean;
}

export const EMPTY_PROMOTION_SAVE_COMPOSITION: PromotionSaveComposition = {
  hasGeneral: false,
  hasSchedule: false,
};

type PromotionDates = DiscoutFormData["dates"];

const isEmptyDescription = (value: string): boolean => {
  if (!value.trim()) {
    return true;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "blocks" in parsed &&
      Array.isArray((parsed as { blocks: unknown }).blocks)
    ) {
      return (parsed as { blocks: unknown[] }).blocks.length === 0;
    }
  } catch {
    return false;
  }

  return false;
};

const normalizeDescription = (value: string): string => {
  if (isEmptyDescription(value)) {
    return "";
  }

  try {
    return JSON.stringify(JSON.parse(value));
  } catch {
    return value;
  }
};

const descriptionsEqual = (current: string, baseline: string): boolean =>
  normalizeDescription(current) === normalizeDescription(baseline);

/** End date/time are ignored when the schedule has no end — they are not persisted. */
export const schedulesEqual = (current: PromotionDates, baseline: PromotionDates): boolean => {
  if (
    current.startDate !== baseline.startDate ||
    current.startTime !== baseline.startTime ||
    current.hasEndDate !== baseline.hasEndDate
  ) {
    return false;
  }

  if (!current.hasEndDate) {
    return true;
  }

  return current.endDate === baseline.endDate && current.endTime === baseline.endTime;
};

export const buildPromotionSaveComposition = (
  current: DiscoutFormData,
  baseline: DiscoutFormData,
): PromotionSaveComposition => ({
  hasGeneral:
    current.name !== baseline.name ||
    current.type !== baseline.type ||
    !descriptionsEqual(current.description, baseline.description),
  hasSchedule: !schedulesEqual(current.dates, baseline.dates),
});

export const hasPromotionSaveComposition = (composition: PromotionSaveComposition): boolean =>
  composition.hasGeneral || composition.hasSchedule;
