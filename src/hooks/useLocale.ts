import { LocaleContext } from "@dashboard/components/Locale";
import { useContext } from "react";

function useLocale() {
  const localeInfo = useContext(LocaleContext);

  return localeInfo;
}
export default useLocale;
