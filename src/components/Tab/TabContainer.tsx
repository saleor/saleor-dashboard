import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

export interface TabContainerProps {
  children: React.ReactNode | React.ReactNodeArray;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  }),
  { name: "TabContainer" },
);

const TabContainer: React.FC<TabContainerProps> = props => {
  const { children } = props;

  const classes = useStyles(props);

  return <div className={classes.root}>{children}</div>;
};
TabContainer.displayName = "TabContainer";

export default TabContainer;
