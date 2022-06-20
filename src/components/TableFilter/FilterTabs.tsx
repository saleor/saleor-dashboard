import { Tabs } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    tabsRoot: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      paddingLeft: theme.spacing(4),
    },
  }),
  { name: "FilterTabs" },
);

interface FilterTabsProps {
  children?: React.ReactNode;
  currentTab: number;
}

export const FilterTabs: React.FC<FilterTabsProps> = props => {
  const { children, currentTab } = props;

  const classes = useStyles(props);

  return (
    <Tabs
      className={classes.tabsRoot}
      value={currentTab}
      indicatorColor={"primary"}
    >
      {children}
    </Tabs>
  );
};

export default FilterTabs;
