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

export const TaxPageTitle: React.FC = () => {
  const classes = useStyles();
  return (
    <span className={classes.wrapper}>
      <FormattedMessage {...sectionNames.taxes} />
      <HorizontalSpacer />
      <PreviewPill />
    </span>
  );
};

export default TaxPageTitle;
