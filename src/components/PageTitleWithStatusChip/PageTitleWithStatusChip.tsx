import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import ExtendedPageHeader from "../ExtendedPageHeader";
export interface PageTitleWithStatusChipProps {
  title: string;
}

const useStyles = makeStyles(
  () => ({
    container: {
      alignItems: "center",
      display: "flex"
    }
  }),
  { name: "OrderDetailsPageTitleWithStatusChip" }
);

const PageTitleWithStatusChip: React.FC<PageTitleWithStatusChipProps> = ({
  title,
  children
}) => {
  const classes = useStyles({});

  return (
    <ExtendedPageHeader
      title={title}
      childrenWrapperClassName={classes.container}
    >
      <>
        <HorizontalSpacer spacing={2} />
        {children}
      </>
    </ExtendedPageHeader>
  );
};

export default PageTitleWithStatusChip;
