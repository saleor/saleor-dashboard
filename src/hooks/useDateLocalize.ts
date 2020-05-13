import { LocaleContext } from "@saleor/components/Locale";
import moment from "moment-timezone";
import { useContext } from "react";

function useDateLocalize(): (date: string) => string {
  const { locale } = useContext(LocaleContext);

  return (date: string) =>
    moment(date)
      .locale(locale)
      .format("ll");
}

export default useDateLocalize;
