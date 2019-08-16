import { LOCALE_URI } from "@saleor/config";
import React from "react";
import { IntlProvider } from "react-intl";
import urlJoin from "url-join";

export type LocaleContextType = string;
export const LocaleContext = React.createContext<LocaleContextType>("en");

const { Consumer: LocaleConsumer, Provider: RawLocaleProvider } = LocaleContext;

const LocaleProvider: React.FC = ({ children }) => {
  const [localeIndex, setLocaleIndex] = React.useState(0);
  const [messages, setMessages] = React.useState({});

  const locale = navigator.languages[localeIndex];

  React.useEffect(() => {
    async function fetchLocale() {
      if (locale) {
        const res = await fetch(urlJoin(LOCALE_URI, `${locale}.json`), {
          credentials: "same-origin",
          mode: "cors"
        });
        if (res.ok) {
          const localeData = await res.json();
          setMessages(localeData);
        } else {
          setLocaleIndex(localeIndex + 1);
        }
      }
    }
    fetchLocale();
  }, [localeIndex]);

  return (
    <IntlProvider locale={locale} messages={messages} key={locale}>
      <RawLocaleProvider value={locale}>{children}</RawLocaleProvider>
    </IntlProvider>
  );
};

export { LocaleConsumer, LocaleProvider, RawLocaleProvider };
