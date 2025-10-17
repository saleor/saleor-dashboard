import { Provider as DateProvider } from "@dashboard/components/Date/DateContext";
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
        <DateProvider value={+new Date("2018-08-07T14:30:44+00:00")}>
          <TimezoneProvider value="America/New_York">
            <ThemeWrapper>
              <AppExtensionPopupProvider>{children}</AppExtensionPopupProvider>
            </ThemeWrapper>
          </TimezoneProvider>
        </DateProvider>
      </RawLocaleProvider>
    </IntlProvider>
  </ApolloMockedProvider>
);

export default Wrapper;
