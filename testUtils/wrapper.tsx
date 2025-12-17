import { Locale, RawLocaleProvider } from "@dashboard/components/Locale";
import { TimezoneProvider } from "@dashboard/components/Timezone";
import { IntlProvider } from "react-intl";

import { ApolloMockedProvider } from "./ApolloMockedProvider";
import { ThemeWrapper } from "./themeWrapper";
import { AppExtensionPopupProvider } from "@dashboard/extensions/components/AppExtensionContext/AppExtensionContextProvider";
import { ReactNode } from "react";

const Wrapper = ({ children }: { children: ReactNode }) => (
  <ApolloMockedProvider>
    <IntlProvider defaultLocale={Locale.EN} locale={Locale.EN}>
      <RawLocaleProvider
        value={{
          locale: Locale.EN,
          setLocale: () => undefined,
        }}
      >
        <TimezoneProvider value="America/New_York">
          <ThemeWrapper>
            <AppExtensionPopupProvider>{children}</AppExtensionPopupProvider>
          </ThemeWrapper>
        </TimezoneProvider>
      </RawLocaleProvider>
    </IntlProvider>
  </ApolloMockedProvider>
);

export default Wrapper;
