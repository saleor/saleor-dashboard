import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
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
        minWidth: 0,
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
    // TODO: Remove me
    richText: {},
  }),
  { name: "Grid" },
);

export const Grid = (props: GridProps) => {
  const { className, children, variant, richText } = props;
  const classes = useStyles(props);

  return (
    <div
      className={clsx(className, classes.root, {
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
