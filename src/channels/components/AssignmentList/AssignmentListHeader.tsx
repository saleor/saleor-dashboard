import { AccordionSummary, Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import IconChevronDown from "@saleor/icons/ChevronDown";
import React from "react";

import { useHeaderStyles } from "./styles";

interface AssignmentListHeaderProps {
  assignCount: number;
  itemsName: string;
}

const AssignmentListHeader: React.FC<AssignmentListHeaderProps> = ({
  assignCount,
  itemsName,
}) => {
  const { container, ...accordion } = useHeaderStyles();

  return (
    <div className={container}>
      <AccordionSummary expandIcon={<IconChevronDown />} classes={accordion}>
        <Typography variant="subtitle2" color="textSecondary">
          {`${assignCount} ${itemsName.toLowerCase()}`}
        </Typography>
      </AccordionSummary>
      <HorizontalSpacer spacing={1.5} />
    </div>
  );
};

export default AssignmentListHeader;
