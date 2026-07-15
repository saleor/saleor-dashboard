import { Tabs } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import type * as React from "react";

const useStyles = makeStyles(
  theme => ({
    tabsRoot: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      paddingLeft: theme.spacing(4),
    },
    tabsRootFlush: {
      paddingLeft: 0,
      "& .MuiTabs-flexContainer": {
        paddingLeft: 0,
      },
    },
  }),
  { name: "FilterTabs" },
);

interface FilterTabsProps {
  children?: React.ReactNode;
  className?: string;
  currentTab: number | undefined;
  /** Removes default page-level left padding — use inside modals or other padded containers. */
  flush?: boolean;
}

const FilterTabs = ({ children, className, currentTab, flush = false }: FilterTabsProps) => {
  const classes = useStyles();

  return (
    <Tabs
      className={clsx(classes.tabsRoot, flush && classes.tabsRootFlush, className)}
      value={currentTab}
      indicatorColor="primary"
    >
      {children}
    </Tabs>
  );
};

export default FilterTabs;
