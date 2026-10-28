import useShop from "@dashboard/hooks/useShop";
import { languageEntitiesPath } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { useEffect } from "react";
import { useRouteMatch } from "react-router";

/**
 * The language of the translation route is the one to reopen next time.
 * The translations language list has no language in the URL and is left alone.
 */
export function useRememberLastTranslationLocale(): void {
  const shop = useShop();
  const match = useRouteMatch<{ languageCode: string }>({
    exact: false,
    path: languageEntitiesPath(":languageCode"),
  });
  const { pushValue } = useCachedLocales();
  const languageCode = match?.params.languageCode;

  useEffect(
    function rememberTranslationLanguage() {
      if (!languageCode || !shop?.languages?.length) {
        return;
      }

      const shopLanguage = shop.languages.find(language => language.code === languageCode);

      if (!shopLanguage) {
        return;
      }

      pushValue(shopLanguage.code);
    },
    [languageCode, pushValue, shop?.languages],
  );
}
