import { LocaleContext } from "@dashboard/components/Locale";
import { useContext } from "react";

export type LocalizeDate = (date: string, format?: string) => string;

/**
 * Backwards compat with old moment.js format.
 */
const FORMAT_OPTIONS: Record<string, Intl.DateTimeFormatOptions> = {
  ll: { dateStyle: "medium" },
  lll: { dateStyle: "medium", timeStyle: "short" },
  llll: {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  },
};

function useDateLocalize(): LocalizeDate {
  const { locale } = useContext(LocaleContext);

  return (date: string, format?: "ll" | "lll" | "llll" | string) => {
    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) {
      return "Invalid date";
    }

    const options = FORMAT_OPTIONS[format || "ll"] ?? FORMAT_OPTIONS.ll;

    return new Intl.DateTimeFormat(locale, options).format(parsed);
  };
}

export default useDateLocalize;
