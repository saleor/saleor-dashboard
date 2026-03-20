const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const MONTH = 2592000; // 30 days
const YEAR = 31536000; // 365 days

const UNITS: Array<{ unit: Intl.RelativeTimeFormatUnit; threshold: number }> = [
  { unit: "year", threshold: YEAR },
  { unit: "month", threshold: MONTH },
  { unit: "day", threshold: DAY },
  { unit: "hour", threshold: HOUR },
  { unit: "minute", threshold: MINUTE },
];

export function getRelativeTime(dateValue: string, nowMs: number, locale: string): string {
  const diffSeconds = Math.round((new Date(dateValue).getTime() - nowMs) / 1000);
  const absDiff = Math.abs(diffSeconds);

  for (const { unit, threshold } of UNITS) {
    if (absDiff >= threshold) {
      const value = Math.round(diffSeconds / threshold);

      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(value, unit);
    }
  }

  // For very recent changes (0-4 seconds), show "now" for a nicer UI
  if (absDiff <= 4) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(0, "second");
  }

  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(diffSeconds, "second");
}
