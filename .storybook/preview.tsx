import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import "@saleor/macaw-ui-next/style";
import type { Preview } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";
import "../src/index.css";
import { ThemeProvider } from "../src/theme";
import { paletteOverrides, themeOverrides } from "../src/themeOverrides";

if (typeof window !== "undefined") {
  (window as any).__SALEOR_CONFIG__ = {
    IS_CLOUD_INSTANCE: "false",
  };
}

const preview: Preview = {
  decorators: [
    Story => (
      <IntlProvider locale="en" onError={() => {}}>
        <LegacyThemeProvider overrides={themeOverrides} palettes={paletteOverrides}>
          <ThemeProvider>
            <Story />
          </ThemeProvider>
        </LegacyThemeProvider>
      </IntlProvider>
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
