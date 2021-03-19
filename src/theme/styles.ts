import muiMakeStyles from "@material-ui/core/styles/makeStyles";
import muiWithStyles from "@material-ui/core/styles/withStyles";
import { StylesHook } from "@material-ui/styles/makeStyles";
import {
  BaseCSSProperties,
  ClassKeyOfStyles,
  ClassNameMap,
  CreateCSSProperties,
  CSSProperties,
  StyledComponentProps,
  StyleRulesCallback,
  Styles,
  WithStylesOptions
} from "@material-ui/styles/withStyles";
import { CoerceEmptyInterface, PropInjector } from "@material-ui/types";

export {
  CreateCSSProperties,
  CSSProperties,
  ClassNameMap,
  StyledComponentProps,
  Styles,
  WithStylesOptions,
  StyleRulesCallback,
  BaseCSSProperties
};
import { SaleorTheme } from "./types";

export function makeStyles<
  Props extends {} = {},
  ClassKey extends string = string
>(
  styles: Styles<SaleorTheme, Props, ClassKey>,
  options?: Omit<WithStylesOptions<SaleorTheme>, "withTheme">
): StylesHook<Styles<SaleorTheme, Props, ClassKey>> {
  return muiMakeStyles(styles, options);
}

export type WithStyles<
  StylesOrClassKey extends string | Styles<any, any, any> = string,
  IncludeTheme extends boolean | undefined = false
> = (IncludeTheme extends true ? { theme: SaleorTheme } : {}) & {
  classes: ClassNameMap<ClassKeyOfStyles<StylesOrClassKey>>;
};

export function withStyles<
  ClassKey extends string,
  Options extends WithStylesOptions<SaleorTheme> = {},
  Props extends Record<string, unknown> = {}
>(
  style: Styles<SaleorTheme, Props, ClassKey>,
  options?: Options
): PropInjector<
  WithStyles<ClassKey, Options["withTheme"]>,
  StyledComponentProps<ClassKey> & CoerceEmptyInterface<Props>
> {
  return muiWithStyles(style, options);
}
