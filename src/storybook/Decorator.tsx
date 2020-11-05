import { Locale, RawLocaleProvider } from "@saleor/components/Locale";
import React from "react";
import { IntlProvider } from "react-intl";

import { Provider as DateProvider } from "../components/Date/DateContext";
import MessageManagerProvider from "../components/messages";
import ThemeProvider from "../components/Theme";
import { TimezoneProvider } from "../components/Timezone";

export const Decorator = storyFn => (
  <IntlProvider defaultLocale={Locale.EN} locale={Locale.EN}>
    <RawLocaleProvider
      value={{
        locale: Locale.EN,
        setLocale: () => undefined
      }}
    >
      <DateProvider value={+new Date("2018-08-07T14:30:44+00:00")}>
        <TimezoneProvider value="America/New_York">
          <ThemeProvider isDefaultDark={false}>
            <MessageManagerProvider>
              <div
                style={{
                  padding: 24
                }}
              >
                {storyFn()}
              </div>
            </MessageManagerProvider>
          </ThemeProvider>
        </TimezoneProvider>
      </DateProvider>
    </RawLocaleProvider>
  </IntlProvider>
);
export default Decorator;
