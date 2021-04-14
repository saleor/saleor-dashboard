import { IThemeColors } from "@saleor/components/Theme/themes";

import { SaleorPaletteOptions } from "./types";

const createPalette = (colors: IThemeColors): SaleorPaletteOptions => ({
  action: {
    active: colors.checkbox.default
  },
  alert: colors.alert,
  background: colors.background,
  divider: colors.divider,
  error: {
    main: colors.error
  },
  primary: {
    contrastText: "#ffffff",
    dark: colors.font.textDisabled,
    main: colors.primary
  },
  secondary: {
    contrastText: "#ffffff",
    main: colors.secondary
  },
  text: {
    disabled: colors.font.gray,
    hint: colors.font.gray,
    primary: colors.font.default,
    secondary: colors.font.gray
  },
  textHighlighted: {
    active: colors.primary,
    inactive: colors.highlightInactive.default
  },
  type: colors.theme
});

export default createPalette;
