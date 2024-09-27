import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";

interface TabContainerProps {
  children: React.ReactNode | React.ReactNodeArray;
  className?: string;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  }),
  { name: "TabContainer" },
);

export const TabContainer: React.FC<TabContainerProps> = props => {
  const { children } = props;
  const classes = useStyles(props);

  return <div className={clsx(classes.root, props.className)}>{children}</div>;
};
