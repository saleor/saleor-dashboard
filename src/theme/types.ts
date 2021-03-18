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

interface IPalette extends Palette, ExtraPaletteOptions {}

interface IPaletteOptions extends PaletteOptions, ExtraPaletteOptions {}

export interface ITheme extends Theme {
  palette: IPalette;
}

export interface IThemeOptions extends ThemeOptions {
  palette: IPaletteOptions;
}
