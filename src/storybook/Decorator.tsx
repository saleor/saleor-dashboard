import { Locale, RawLocaleProvider } from "@saleor/components/Locale";
import React from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import { Provider as DateProvider } from "../components/Date/DateContext";
import MessageManagerProvider from "../components/messages";
import ThemeProvider from "../components/Theme";
import { TimezoneProvider } from "../components/Timezone";
import { APP_MOUNT_URI } from "../config";

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
            <BrowserRouter basename={APP_MOUNT_URI}>
              <MessageManagerProvider>
                <div
                  style={{
                    padding: 24
                  }}
                >
                  {storyFn()}
                </div>
              </MessageManagerProvider>
            </BrowserRouter>
          </ThemeProvider>
        </TimezoneProvider>
      </DateProvider>
    </RawLocaleProvider>
  </IntlProvider>
);
export default Decorator;
