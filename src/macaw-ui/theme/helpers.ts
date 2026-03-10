import { assignInlineVars } from "@vanilla-extract/dynamic";

import { DefaultTheme, themes } from "./themes";
import { vars } from "./contract.css";

export const getCSSVariables = (theme: DefaultTheme) =>
  assignInlineVars(vars, themes[theme]);
