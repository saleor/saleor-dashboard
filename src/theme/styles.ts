import muiMakeStyles from "@material-ui/core/styles/makeStyles";
import useMuiTheme from "@material-ui/core/styles/useTheme";
import muiWithStyles from "@material-ui/core/styles/withStyles";
import { StyleRules } from "@material-ui/styles/withStyles";
import {
  ClassKeyOfStyles,
  ClassNameMap,
  StyledComponentProps,
  Styles,
  WithStylesOptions
} from "@material-ui/styles/withStyles";
import { PropInjector } from "@material-ui/types";

import { SaleorTheme } from "./types";

export function makeStyles<
  Props extends Record<string, any> = {},
  ClassKey extends string = string
>(
  styles: Styles<SaleorTheme, Props, ClassKey>,
  options?: Omit<WithStylesOptions<SaleorTheme>, "withTheme">
): keyof Props extends never
  ? (props?: any) => ClassNameMap<ClassKey>
  : (props: Props) => ClassNameMap<ClassKey> {
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
  Props extends Record<string, any> = {}
>(
  style: Styles<SaleorTheme, Props, ClassKey>,
  options?: Options
): PropInjector<
  WithStyles<ClassKey, Options["withTheme"]>,
  StyledComponentProps<ClassKey> & Props
> {
  return muiWithStyles(style, options);
}

export function useTheme(): SaleorTheme {
  return useMuiTheme();
}

export function createStyles<ClassKey extends string, Props extends {}>(
  styles: StyleRules<Props, ClassKey>
): StyleRules<Props, ClassKey> {
  return styles;
}
