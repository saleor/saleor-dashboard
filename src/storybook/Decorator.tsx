import React from "react";
import { IntlProvider } from "react-intl";

import { RawLocaleProvider } from "@saleor/components/Locale";
import { Provider as DateProvider } from "../components/Date/DateContext";
import { MessageManager } from "../components/messages";
import ThemeProvider from "../components/Theme";
import { TimezoneProvider } from "../components/Timezone";

export const Decorator = storyFn => (
  <IntlProvider defaultLocale="en" locale="en">
    <RawLocaleProvider value="en">
      <DateProvider value={+new Date("2018-08-07T14:30:44+00:00")}>
        <TimezoneProvider value="America/New_York">
          <ThemeProvider isDefaultDark={false}>
            <MessageManager>
              <div
                style={{
                  padding: 24
                }}
              >
                {storyFn()}
              </div>
            </MessageManager>
          </ThemeProvider>
        </TimezoneProvider>
      </DateProvider>
    </RawLocaleProvider>
  </IntlProvider>
);
export default Decorator;
