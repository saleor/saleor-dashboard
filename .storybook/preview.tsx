import { ApolloProvider } from "@apollo/client";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import "@saleor/macaw-ui-next/style";
import type { Preview } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";
import { apolloClient } from "../src/graphql/client";
import "../src/index.css";
import { ThemeProvider } from "../src/theme";
import { paletteOverrides, themeOverrides } from "../src/themeOverrides";

const preview: Preview = {
  decorators: [
    Story => (
      <ApolloProvider client={apolloClient}>
        <MemoryRouter>
          <IntlProvider locale="en" onError={() => {}}>
            {/* @ts-expect-error legacy types  */}
            <LegacyThemeProvider overrides={themeOverrides} palettes={paletteOverrides}>
              <ThemeProvider>
                <Story />
              </ThemeProvider>
            </LegacyThemeProvider>
          </IntlProvider>
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
