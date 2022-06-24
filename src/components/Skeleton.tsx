import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    "@keyframes skeleton-animation": {
      "0%": {
        opacity: 0.6,
      },
      "100%": {
        opacity: 1,
      },
    },
    primary: {
      "&$skeleton": {
        background: theme.palette.primary.main,
      },
    },
    skeleton: {
      animation: "skeleton-animation .75s linear infinite forwards alternate",
      background: theme.palette.background.default,
      borderRadius: 4,
      display: "block",
      height: "0.8em",
      margin: "0.2em 0",
    },
  }),
  { name: "Skeleton" },
);

interface SkeletonProps {
  className?: string;
  primary?: boolean;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = props => {
  const { className, primary, style } = props;

  const classes = useStyles(props);

  return (
    <span
      data-test-id="skeleton"
      className={classNames(classes.skeleton, className, {
        [classes.primary]: primary,
      })}
      style={style}
    >
      &zwnj;
    </span>
  );
};

Skeleton.displayName = "Skeleton";
export default Skeleton;
