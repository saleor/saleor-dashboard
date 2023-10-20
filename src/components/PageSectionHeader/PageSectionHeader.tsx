import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import { Typography } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

interface PageSectionHeaderProps {
  title?: string;
  description?: string;
}

const PageSectionHeader: React.FC<PageSectionHeaderProps> = props => {
  const { title, description } = props;

  return (
    <Box paddingTop={6}>
      {title && <Typography variant="h5">{title}</Typography>}
      {title && description && <VerticalSpacer />}
      {description && <Typography variant="body2">{description}</Typography>}
    </Box>
  );
};

PageSectionHeader.displayName = "PageSectionHeader";
export default PageSectionHeader;
