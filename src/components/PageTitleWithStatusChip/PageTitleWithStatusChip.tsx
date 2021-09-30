import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
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
    <div className={classes.container}>
      {title}
      <HorizontalSpacer spacing={2} />
      {children}
    </div>
  );
};

export default PageTitleWithStatusChip;
