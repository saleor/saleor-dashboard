import { Typography } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import React from "react";

interface PageSectionHeaderProps {
  title?: string;
  description?: string;
}

const PageSectionHeader: React.FC<PageSectionHeaderProps> = props => {
  const { title, description } = props;

  return (
    <div>
      {title && <Typography variant="h5">{title}</Typography>}
      {title && description && <VerticalSpacer />}
      {description && <Typography variant="body2">{description}</Typography>}
    </div>
  );
};

PageSectionHeader.displayName = "PageSectionHeader";
export default PageSectionHeader;
