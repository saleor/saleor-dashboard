/* eslint-disable @typescript-eslint/unified-signatures */
import { Theme } from "@material-ui/core/styles";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";
import {
  Palette,
  PaletteOptions
} from "@material-ui/core/styles/createPalette";

export type AlertPalette = Record<
  "success" | "error" | "warning" | "info",
  string
>;
export type AlertColors = Record<"paper" | "icon", AlertPalette>;
interface ExtraPaletteOptions {
  alert?: AlertColors;
  textHighlighted?: {
    active: string;
    inactive: string;
  };
}

export interface SaleorPalette extends Palette, ExtraPaletteOptions {}

export interface SaleorPaletteOptions
  extends PaletteOptions,
    ExtraPaletteOptions {}

export interface SaleorSpacing {
  (): string;
  (value: number): string;
  (topBottom: number, rightLeft: number): string;
  (top: number, rightLeft: number, bottom: number): string;
  (top: number, right: number, bottom: number, left: number): string;
}

export interface SaleorTheme extends Omit<Theme, "spacing"> {
  palette: SaleorPalette;
  spacing: SaleorSpacing;
}

export interface SaleorThemeOptions extends ThemeOptions {
  palette: SaleorPaletteOptions;
}
