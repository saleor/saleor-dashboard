import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import PreviewPill from "@dashboard/components/PreviewPill";
import { sectionNames } from "@dashboard/intl";
import { makeStyles } from "@saleor/macaw-ui";
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
