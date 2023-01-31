import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import {
  DefaultTheme,
  ThemeProvider as MacawThemeProvider,
} from "@saleor/macaw-ui/next";
import React, { useEffect } from "react";

import { defaultTheme, localStorageKey } from "./consts";

export const ThemeProvider: React.FC = ({ children }) => {
  const [activeTheme, setActiveTheme] = useLocalStorage<DefaultTheme>(
    localStorageKey,
    defaultTheme,
  );

  useEffect(() => {
    setActiveTheme(defaultTheme);
  });

  return (
    <MacawThemeProvider defaultTheme={activeTheme}>
      {children}
    </MacawThemeProvider>
  );
};
