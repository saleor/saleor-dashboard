import { ExternalAppProvider } from "@dashboard/apps/components/ExternalAppContext";
import { Provider as DateProvider } from "@dashboard/components/Date/DateContext";
import { Locale, RawLocaleProvider } from "@dashboard/components/Locale";
import { TimezoneProvider } from "@dashboard/components/Timezone";
import { ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { ApolloMockedProvider } from "./ApolloMockedProvider";
import { ThemeWrapper } from "./themeWrapper";

const Wrapper = ({ children }: { children: ReactNode }) => (
  <ApolloMockedProvider>
    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
    {/* @ts-ignore */}
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
              <ExternalAppProvider>{children}</ExternalAppProvider>
            </ThemeWrapper>
          </TimezoneProvider>
        </DateProvider>
      </RawLocaleProvider>
    </IntlProvider>
  </ApolloMockedProvider>
);

export default Wrapper;
