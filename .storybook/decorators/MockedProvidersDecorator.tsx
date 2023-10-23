import "@saleor/macaw-ui-next/style";

import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import React from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";
import { ExternalAppProvider } from "../../src/apps/components/ExternalAppContext";
import { DevModeProvider } from "../../src/components/DevModePanel/DevModeProvider";
import { Locale, RawLocaleProvider } from "../../src/components/Locale";
import { paletteOverrides, themeOverrides } from "../../src/themeOverrides";

import { Provider as DateProvider } from "../../src/components/Date/DateContext";
import { TimezoneProvider } from "../../src/components/Timezone";
import MessageManagerProvider from "../../src/components/messages";
import { getAppMountUri } from "../../src/config";
import { ApolloMockedProvider } from "../../testUtils/ApolloMockedProvider";
import { FeatureFlagsProvider } from "@dashboard/featureFlags";

export const MockedProvidersDecorator: React.FC = ({ children }) => (
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
            <LegacyThemeProvider
              overrides={themeOverrides}
              palettes={paletteOverrides}
            >
              <ThemeProvider>
                <BrowserRouter basename={getAppMountUri()}>
                  <ExternalAppProvider>
                    <FeatureFlagsProvider strategies={[]}>
                      <MessageManagerProvider>
                        <DevModeProvider>
                          <div
                            style={{
                              padding: 24,
                            }}
                          >
                            {children}
                          </div>
                        </DevModeProvider>
                      </MessageManagerProvider>
                    </FeatureFlagsProvider>
                  </ExternalAppProvider>
                </BrowserRouter>
              </ThemeProvider>
            </LegacyThemeProvider>
          </TimezoneProvider>
        </DateProvider>
      </RawLocaleProvider>
    </IntlProvider>
  </ApolloMockedProvider>
);
