import React from "react";
import { IntlProvider } from "react-intl";

export type LocaleContextType = string;
export const LocaleContext = React.createContext<LocaleContextType>("en");

const { Consumer: LocaleConsumer, Provider } = LocaleContext;

const LocaleProvider = ({ children }) => {
  const [locale] = React.useState(navigator.language);

  return (
    <IntlProvider locale={locale}>
      <Provider value={navigator.language}>{children}</Provider>
    </IntlProvider>
  );
};

export { LocaleConsumer, LocaleProvider };
