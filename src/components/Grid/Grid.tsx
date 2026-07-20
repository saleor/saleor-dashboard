import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import type * as React from "react";

type GridVariant = "default" | "inverted" | "uniform";
interface GridProps {
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
      "& > div:first-child": {
        position: "sticky",
        top: 0,
        alignSelf: "start",
      },
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

export const Grid = ({ className, children, variant = "default", richText }: GridProps) => {
  const classes = useStyles({ className, children, variant, richText });

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
export default Grid;
