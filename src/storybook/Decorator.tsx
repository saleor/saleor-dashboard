import { Locale, RawLocaleProvider } from "@saleor/components/Locale";
import React from "react";
import { Provider as AlertProvider } from "react-alert";
import { IntlProvider } from "react-intl";

import { Provider as DateProvider } from "../components/Date/DateContext";
import { MessageManager, notificationOptions } from "../components/messages";
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
            <AlertProvider {...notificationOptions} template={MessageManager}>
              <div
                style={{
                  padding: 24
                }}
              >
                {storyFn()}
              </div>
            </AlertProvider>
          </ThemeProvider>
        </TimezoneProvider>
      </DateProvider>
    </RawLocaleProvider>
  </IntlProvider>
);
export default Decorator;
