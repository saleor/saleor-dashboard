import { LocaleContext } from "@saleor/components/Locale";
import moment from "moment-timezone";
import { useContext } from "react";

export type LocalizeDate = (date: string, format?: string) => string;

function useDateLocalize(): (date: string, format?: string) => string {
  const { locale } = useContext(LocaleContext);

  return (date: string, format?: string) =>
    moment(date)
      .locale(locale)
      .format(format || "ll");
}

export default useDateLocalize;
