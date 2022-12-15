import { Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import Skeleton from "@saleor/components/Skeleton";
import { AccordionSummary } from "@saleor/macaw-ui";
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
  const { container, skeleton, ...accordion } = useHeaderStyles();

  return (
    <div className={container}>
      <AccordionSummary className={accordion.root}>
        {loading ? (
          <Skeleton className={skeleton} />
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
