import { ApolloProvider } from "@apollo/client";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import "@saleor/macaw-ui-next/style";
import type { Preview } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";
import { LocaleContext } from "../src/components/Locale/Locale";
import { apolloClient } from "../src/graphql/client";
import "../src/index.css";
import { ThemeProvider } from "../src/theme";
import { paletteOverrides, themeOverrides } from "../src/themeOverrides";

const preview: Preview = {
  decorators: [
    Story => (
      <ApolloProvider client={apolloClient}>
        <MemoryRouter>
          <LocaleContext.Provider value={{ locale: "en" as any, setLocale: () => {} }}>
            <IntlProvider locale="en" onError={() => {}}>
              {/* @ts-expect-error legacy types  */}
              <LegacyThemeProvider overrides={themeOverrides} palettes={paletteOverrides}>
                <ThemeProvider>
                  <Story />
                </ThemeProvider>
              </LegacyThemeProvider>
            </IntlProvider>
          </LocaleContext.Provider>
        </MemoryRouter>
      </ApolloProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
