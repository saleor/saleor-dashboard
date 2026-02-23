import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { type DefaultTheme, ThemeProvider as MacawThemeProvider } from "@saleor/macaw-ui-next";
import type * as React from "react";

import { defaultTheme, localStorageKey } from "./consts";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTheme] = useLocalStorage<DefaultTheme>(localStorageKey, defaultTheme);

  return <MacawThemeProvider defaultTheme={activeTheme}>{children}</MacawThemeProvider>;
};
