import muiMakeStyles from "@material-ui/core/styles/makeStyles";
import useMuiTheme from "@material-ui/core/styles/useTheme";
import {
  ClassNameMap,
  Styles,
  WithStylesOptions
} from "@material-ui/styles/withStyles";

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

export function useTheme(): SaleorTheme {
  return useMuiTheme();
}
