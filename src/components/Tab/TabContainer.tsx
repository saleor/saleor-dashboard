import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import * as React from "react";

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

export const TabContainer = (props: TabContainerProps) => {
  const { children } = props;
  const classes = useStyles(props);

  return <div className={clsx(classes.root, props.className)}>{children}</div>;
};

TabContainer.displayName = "TabContainer";
