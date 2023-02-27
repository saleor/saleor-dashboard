import { ExternalAppProvider } from "@dashboard/apps/components/ExternalAppContext";
import { Locale, RawLocaleProvider } from "@dashboard/components/Locale";
import { FlagsServiceProvider } from "@dashboard/hooks/useFlags/flagsService";
import { paletteOverrides, themeOverrides } from "@dashboard/themeOverrides";
import { ThemeProvider } from "@saleor/macaw-ui";
import React from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import { ApolloMockedProvider } from "../../testUtils/ApolloMockedProvider";
import { Provider as DateProvider } from "../components/Date/DateContext";
import MessageManagerProvider from "../components/messages";
import { TimezoneProvider } from "../components/Timezone";
import { getAppMountUri } from "../config";

export const Decorator = storyFn => (
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
            <ThemeProvider overrides={themeOverrides} palettes={paletteOverrides}>
              <BrowserRouter basename={getAppMountUri()}>
                <ExternalAppProvider>
                  <FlagsServiceProvider>
                    <MessageManagerProvider>
                      <div
                        style={{
                          padding: 24,
                        }}
                      >
                        {storyFn()}
                      </div>
                    </MessageManagerProvider>
                  </FlagsServiceProvider>
                </ExternalAppProvider>
              </BrowserRouter>
            </ThemeProvider>
          </TimezoneProvider>
        </DateProvider>
      </RawLocaleProvider>
    </IntlProvider>
  </ApolloMockedProvider>
);
export default Decorator;
