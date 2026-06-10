import { ApolloProvider } from "@apollo/client";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import {
  type DefaultTheme,
  ThemeProvider as MacawThemeProvider,
  useTheme,
  vars,
} from "@saleor/macaw-ui-next";
import "@saleor/macaw-ui-next/style";
import type { Preview } from "@storybook/react-vite";
import { useEffect, type ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";
import { configure } from "storybook/test";
import { LocaleContext } from "../src/components/Locale/Locale";
import { apolloClient } from "../src/graphql/client";
import { PaginatorContext } from "../src/hooks/usePaginator";
import "../src/index.css";
import { paletteOverrides, themeOverrides } from "../src/themeOverrides";

configure({ testIdAttribute: "data-test-id" });

const ThemeSync = ({ theme, children }: { theme: DefaultTheme; children: ReactNode }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return <>{children}</>;
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Macaw UI theme",
      defaultValue: "defaultLight",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "defaultLight", title: "Light" },
          { value: "defaultDark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as DefaultTheme) ?? "defaultLight";

      return (
        <ApolloProvider client={apolloClient}>
          <MemoryRouter>
            <LocaleContext.Provider value={{ locale: "en" as any, setLocale: () => {} }}>
              <IntlProvider locale="en" onError={() => {}}>
                {/* @ts-expect-error legacy types  */}
                <LegacyThemeProvider overrides={themeOverrides} palettes={paletteOverrides}>
                  <MacawThemeProvider defaultTheme={theme}>
                    <ThemeSync theme={theme}>
                      <PaginatorContext.Provider
                        value={{
                          hasNextPage: false,
                          hasPreviousPage: false,
                          paginatorType: "link",
                          nextHref: undefined,
                          prevHref: undefined,
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: vars.colors.background.default1,
                            color: vars.colors.text.default1,
                            minHeight: "100vh",
                          }}
                        >
                          <Story />
                        </div>
                      </PaginatorContext.Provider>
                    </ThemeSync>
                  </MacawThemeProvider>
                </LegacyThemeProvider>
              </IntlProvider>
            </LocaleContext.Provider>
          </MemoryRouter>
        </ApolloProvider>
      );
    },
  ],
  parameters: {
    chromatic: {
      delay: 500,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
