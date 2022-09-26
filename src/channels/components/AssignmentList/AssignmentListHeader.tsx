import { AccordionSummary, Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import Skeleton from "@saleor/components/Skeleton";
import IconChevronDown from "@saleor/icons/ChevronDown";
import React from "react";

import { useHeaderStyles } from "./styles";

interface AssignmentListHeaderProps {
  assignCount: number;
  itemsName: string;
  loading: boolean;
}

const AssignmentListHeader: React.FC<AssignmentListHeaderProps> = ({
  assignCount,
  itemsName,
  loading,
}) => {
  const classes = useHeaderStyles();

  return (
    <div className={classes.container}>
      <AccordionSummary expandIcon={<IconChevronDown />} classes={classes}>
        {loading ? (
          <Skeleton className={classes.skeleton} />
        ) : (
          <Typography variant="subtitle2" color="textSecondary">
            {`${assignCount} ${itemsName.toLowerCase()}`}
          </Typography>
        )}
      </AccordionSummary>
      <HorizontalSpacer spacing={1.5} />
    </div>
  );
};

export default AssignmentListHeader;
