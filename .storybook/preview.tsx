import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import "@saleor/macaw-ui-next/style";
import type { Preview } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";
import "../src/index.css";
import { ThemeProvider } from "../src/theme";
import { paletteOverrides, themeOverrides } from "../src/themeOverrides";

const preview: Preview = {
  decorators: [
    Story => (
      <MemoryRouter>
        <IntlProvider locale="en" onError={() => {}}>
          <LegacyThemeProvider overrides={themeOverrides} palettes={paletteOverrides}>
            <ThemeProvider>
              <Story />
            </ThemeProvider>
          </LegacyThemeProvider>
        </IntlProvider>
      </MemoryRouter>
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
