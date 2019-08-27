import React from "react";
import { IntlProvider } from "react-intl";

export type LocaleContextType = string;
export const LocaleContext = React.createContext<LocaleContextType>("en");

const { Consumer: LocaleConsumer, Provider: RawLocaleProvider } = LocaleContext;

enum Locale {
  EN = "en",
  EN_GB = "en-gb",
  EN_US = "en-us"
}

type LocaleMessages = Record<string, string>;
const localeData: Record<Locale, LocaleMessages> = {
  [Locale.EN]: {},
  [Locale.EN_GB]: {},
  [Locale.EN_US]: {}
};

function getMatchingLocale(): Locale {
  const localeEntries = Object.entries(Locale);

  for (const preferredLocale of navigator.languages) {
    for (const localeEntry of localeEntries) {
      if (localeEntry[1].toLowerCase() === preferredLocale.toLowerCase()) {
        return Locale[localeEntry[0]];
      }
    }
  }
}

const LocaleProvider: React.FC = ({ children }) => {
  const [locale] = React.useState(getMatchingLocale());

  return (
    <IntlProvider locale={locale} messages={localeData[locale]} key={locale}>
      <RawLocaleProvider value={locale}>{children}</RawLocaleProvider>
    </IntlProvider>
  );
};

export { LocaleConsumer, LocaleProvider, RawLocaleProvider };
