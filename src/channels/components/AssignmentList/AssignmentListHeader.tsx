import { AccordionSummary, Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import IconChevronDown from "@saleor/icons/ChevronDown";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    // empty expanded needed for mui to use root styles
    expanded: {},
    root: {
      width: "100%",
      border: "none",
      marginRight: theme.spacing(1),
      padding: 0,
      paddingBottom: theme.spacing(2),
      minHeight: 0,

      "&$expanded": {
        minHeight: 0,
      },
    },
    content: {
      margin: 0,

      "&$expanded": {
        margin: 0,
      },
    },
  }),
  { name: "AssignmentListHeader" },
);

interface AssignmentListHeaderProps {
  assignCount: number;
  totalCount: number;
  itemsName: string;
}

const AssignmentListHeader: React.FC<AssignmentListHeaderProps> = ({
  assignCount,
  totalCount,
  itemsName,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <AccordionSummary expandIcon={<IconChevronDown />} classes={classes}>
        <Typography variant="subtitle2" color="textSecondary">
          {`${assignCount} / ${totalCount} ${itemsName.toLowerCase()}`}
        </Typography>
      </AccordionSummary>
      <HorizontalSpacer spacing={1.5} />
    </div>
  );
};

export default AssignmentListHeader;
