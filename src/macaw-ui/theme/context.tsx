import { createContext, useContext, useLayoutEffect, useState } from "react";
import { setElementVars } from "@vanilla-extract/dynamic";

import { DefaultTheme, themes, ThemeTokensValues } from "./themes";

import { vars } from "./contract.css";

const ThemeContext = createContext<{
  theme: DefaultTheme;
  setTheme: (to: DefaultTheme) => void;
  themeValues: ThemeTokensValues;
} | null>(null);

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme: DefaultTheme;
};

export const ThemeContextProvider = ({
  children,
  defaultTheme,
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState(defaultTheme);

  useLayoutEffect(() => {
    setElementVars(document.documentElement, vars, themes[theme]);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, themeValues: themes[theme] }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used within a MacawUI ThemeContext");
  }
  return context;
};
