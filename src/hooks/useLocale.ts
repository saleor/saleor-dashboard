import { LocaleContext } from "@saleor/components/Locale";
import { useContext } from "react";

function useLocale() {
  const localeInfo = useContext(LocaleContext);
  return localeInfo;
}
export default useLocale;
