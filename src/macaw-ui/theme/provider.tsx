import "./reset.css";
import "./fonts.css";
import "./global.css";

import { ThemeContextProvider } from "./context";
import { DefaultTheme } from "./themes";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: DefaultTheme;
};

export const ThemeProvider = ({
  children,
  defaultTheme = "defaultLight",
}: ThemeProviderProps) => (
  <ThemeContextProvider defaultTheme={defaultTheme}>
    <main id="macaw-ui-root">{children}</main>
  </ThemeContextProvider>
);
