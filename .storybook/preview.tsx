import "@saleor/macaw-ui-next/style";
import "../src/index.css";
import { IntlProvider } from "react-intl";
import type { Preview } from "@storybook/react-vite";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "../src/theme";
import { paletteOverrides, themeOverrides } from "../src/themeOverrides";

if (typeof window !== "undefined") {
  (window as any).__SALEOR_CONFIG__ = {
    IS_CLOUD_INSTANCE: "false",
  };
}

const preview: Preview = {
  decorators: [
    (Story) => (
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

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
