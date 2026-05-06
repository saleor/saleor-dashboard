import { Tabs } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import type * as React from "react";

const useStyles = makeStyles(
  theme => ({
    tabsRoot: {
      // Use the macaw-ui-next border token instead of MUI's palette.divider —
      // the latter falls back to rgba(255,255,255,0.12) in dark mode, which is
      // virtually invisible against the navy app surface.
      borderBottom: "1px solid var(--mu-colors-border-default1)",
      paddingLeft: theme.spacing(4),
    },
  }),
  { name: "FilterTabs" },
);

interface FilterTabsProps {
  children?: React.ReactNode;
  currentTab: number | undefined;
}

const FilterTabs = (props: FilterTabsProps) => {
  const { children, currentTab } = props;
  const classes = useStyles(props);

  return (
    <Tabs className={classes.tabsRoot} value={currentTab} indicatorColor={"primary"}>
      {children}
    </Tabs>
  );
};

export default FilterTabs;
