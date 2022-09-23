import { AccordionSummary, Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import Skeleton from "@saleor/components/Skeleton";
import IconChevronDown from "@saleor/icons/ChevronDown";
import React from "react";

import {
  useHeaderContainerStyles,
  useHeaderSkeletonStyles,
  useHeaderStyles,
} from "./styles";

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
  const acordionSUmmaryClasses = useHeaderStyles();
  const containerClases = useHeaderContainerStyles();
  const skeletonClasses = useHeaderSkeletonStyles();

  return (
    <div className={containerClases.container}>
      <AccordionSummary
        expandIcon={<IconChevronDown />}
        classes={acordionSUmmaryClasses}
      >
        {loading ? (
          <Skeleton className={skeletonClasses.skeleton} />
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
