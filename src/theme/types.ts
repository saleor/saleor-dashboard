import { Theme } from "@material-ui/core/styles";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";
import {
  Palette,
  PaletteOptions
} from "@material-ui/core/styles/createPalette";

interface ExtraPaletteOptions {
  textHighlighted?: {
    active: string;
    inactive: string;
  };
}

export interface SaleorPalette extends Palette, ExtraPaletteOptions {}

export interface SaleorPaletteOptions
  extends PaletteOptions,
    ExtraPaletteOptions {}

export interface SaleorTheme extends Theme {
  palette: SaleorPalette;
}

export interface SaleorThemeOptions extends ThemeOptions {
  palette: SaleorPaletteOptions;
}
