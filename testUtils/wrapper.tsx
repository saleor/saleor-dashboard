import { Provider as DateProvider } from "@saleor/components/Date/DateContext";
import { Locale, RawLocaleProvider } from "@saleor/components/Locale";
import { TimezoneProvider } from "@saleor/components/Timezone";
import { ThemeProvider } from "@saleor/macaw-ui";
import React from "react";
import { IntlProvider } from "react-intl";

const Wrapper: React.FC = ({ children }) => (
  <IntlProvider defaultLocale={Locale.EN} locale={Locale.EN}>
    <RawLocaleProvider
      value={{
        locale: Locale.EN,
        setLocale: () => undefined
      }}
    >
      <DateProvider value={+new Date("2018-08-07T14:30:44+00:00")}>
        <TimezoneProvider value="America/New_York">
          <ThemeProvider>{children}</ThemeProvider>
        </TimezoneProvider>
      </DateProvider>
    </RawLocaleProvider>
  </IntlProvider>
);

export default Wrapper;
