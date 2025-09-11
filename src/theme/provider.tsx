import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { DefaultTheme, ThemeProvider as MacawThemeProvider } from "@saleor/macaw-ui-next";
import * as React from "react";

import { defaultTheme, localStorageKey } from "./consts";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTheme] = useLocalStorage<DefaultTheme>(localStorageKey, defaultTheme);

  return <MacawThemeProvider defaultTheme={activeTheme}>{children}</MacawThemeProvider>;
};
