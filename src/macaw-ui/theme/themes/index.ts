import { defaultDark } from "./defaultDark";
import { defaultLight } from "./defaultLight";

export const themes = {
  defaultLight,
  defaultDark,
};

export type DefaultTheme = "defaultLight" | "defaultDark";

export type ThemeTokensValues = (typeof themes)[DefaultTheme];
