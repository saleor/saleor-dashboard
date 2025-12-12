import { IntlShape } from "../../../../../react-intl";

export type RelativeTimeUnit = "day" | "hour" | "minute";

export interface RelativeTimeValue {
  value: number;
  unit: RelativeTimeUnit;
}

export const MS_PER_MINUTE = 60 * 1000;
export const MS_PER_HOUR = 60 * MS_PER_MINUTE;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

export const getRelativeTimeUnit = (milliseconds: number): RelativeTimeValue => {
  const absMs = Math.abs(milliseconds);

  if (absMs >= MS_PER_DAY) {
    return { value: Math.round(absMs / MS_PER_DAY), unit: "day" };
  }

  if (absMs >= MS_PER_HOUR) {
    return { value: Math.round(absMs / MS_PER_HOUR), unit: "hour" };
  }

  return { value: Math.round(absMs / MS_PER_MINUTE), unit: "minute" };
};

export const formatTimeDifference = (milliseconds: number, intl: IntlShape): string => {
  const { value, unit } = getRelativeTimeUnit(milliseconds);

  // Format as relative time and strip "in" / "ago" prefixes/suffixes
  // to get just the duration (e.g., "2 days" instead of "in 2 days")
  return intl
    .formatRelativeTime(value, unit, { numeric: "always", style: "long" })
    .replace(/^in /, "")
    .replace(/ ago$/, "");
};

export const formatDateTime = (date: string, time: string, intl: IntlShape): string => {
  if (!date) {
    return "";
  }

  const dateObj = new Date(`${date}T${time || "00:00"}`);

  return intl.formatDate(dateObj, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
