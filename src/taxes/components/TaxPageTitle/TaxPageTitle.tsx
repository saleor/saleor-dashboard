import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import PreviewPill from "@saleor/components/PreviewPill";
import { sectionNames } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  () => ({
    wrapper: {
      display: "flex",
    },
  }),
  { name: "TaxPageTitle" },
);

export const TaxPageTitle = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <FormattedMessage {...sectionNames.taxes} />
      <HorizontalSpacer />
      <PreviewPill />
    </div>
  );
};

export default TaxPageTitle;
