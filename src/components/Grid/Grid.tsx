import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";

export type GridVariant = "default" | "inverted" | "uniform";
export interface GridProps extends WithStyles<typeof styles> {
  children: React.ReactNodeArray | React.ReactNode;
  className?: string;
  variant?: GridVariant;
}

const styles = (theme: Theme) =>
  createStyles({
    default: {
      gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)"
    },
    inverted: {
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)"
    },
    root: {
      display: "grid",
      gridColumnGap: theme.spacing.unit * 3 + "px",
      gridRowGap: theme.spacing.unit * 3 + "px",
      [theme.breakpoints.down("sm")]: {
        gridRowGap: theme.spacing.unit + "px",
        gridTemplateColumns: "1fr"
      }
    },
    uniform: {
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)"
    }
  });

export const Grid = withStyles(styles, { name: "Grid" })(
  ({ className, children, classes, variant }: GridProps) => (
    <div
      className={classNames(className, classes.root, {
        [classes.default]: variant === "default",
        [classes.inverted]: variant === "inverted",
        [classes.uniform]: variant === "uniform"
      })}
    >
      {children}
    </div>
  )
);
Grid.displayName = "Grid";
Grid.defaultProps = {
  variant: "default"
};
export default Grid;
