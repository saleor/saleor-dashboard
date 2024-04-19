import { Tab } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    selectedTabLabel: {
      "&$tabLabel": {
        color: theme.typography.body1.color,
      },
    },
    tabLabel: {
      "&:hover": {
        color: theme.typography.body1.color,
      },
      color: theme.typography.caption.color,
      fontSize: theme.typography.body1.fontSize,
      fontWeight: 500,
    },
    tabRoot: {
      minWidth: "80px",
      opacity: 1,
      paddingTop: theme.spacing(1),
      textTransform: "initial" as const,
    },
  }),
  { name: "FilterTab" },
);

interface FilterTabProps {
  onClick: () => void;
  label: string;
  selected?: boolean;
  value?: number;
}

export const FilterTab: React.FC<FilterTabProps> = props => {
  const { onClick, label, selected, value } = props;
  const classes = useStyles(props);

  return (
    <Tab
      disableRipple
      label={label}
      classes={{
        root: classes.tabRoot,
        wrapper: clsx(classes.tabLabel, {
          [classes.selectedTabLabel]: selected,
        }),
      }}
      onClick={onClick}
      value={value}
    />
  );
};
FilterTab.displayName = "FilterTab";
export default FilterTab;
