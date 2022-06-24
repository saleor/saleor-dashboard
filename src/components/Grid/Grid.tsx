import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

export type GridVariant = "default" | "inverted" | "uniform";
export interface GridProps {
  children: React.ReactNodeArray | React.ReactNode;
  className?: string;
  variant?: GridVariant;
  richText?: boolean;
}

const useStyles = makeStyles(
  theme => ({
    default: {
      gridTemplateColumns: "9fr 4fr",
    },
    inverted: {
      gridTemplateColumns: "4fr 9fr",
    },
    root: {
      "& > div": {
        overflow: "hidden",
      },
      display: "grid",
      gridColumnGap: theme.spacing(3),
      gridRowGap: theme.spacing(3),
      [theme.breakpoints.down("sm")]: {
        gridRowGap: theme.spacing(1),
        gridTemplateColumns: "1fr",
      },
    },
    uniform: {
      gridTemplateColumns: "1fr 1fr",
    },
    richText: {
      "&& > div": {
        overflow: "visible",
      },
    },
  }),
  { name: "Grid" },
);

export const Grid: React.FC<GridProps> = props => {
  const { className, children, variant, richText } = props;

  const classes = useStyles(props);

  return (
    <div
      className={classNames(className, classes.root, {
        [classes.default]: variant === "default",
        [classes.inverted]: variant === "inverted",
        [classes.uniform]: variant === "uniform",
        [classes.richText]: richText,
      })}
    >
      {children}
    </div>
  );
};
Grid.displayName = "Grid";
Grid.defaultProps = {
  variant: "default",
};
export default Grid;
