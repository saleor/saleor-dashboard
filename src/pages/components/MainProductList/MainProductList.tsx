import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/theme";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible"
    }
  },
  { name: "PageInfo" }
);
interface Props {
  mock?: string;
}

export const MainProductList: React.FC<Props> = props => {
  const classes = useStyles(props);
  const intl = useIntl();
  return (
    <Card className={classes.root}>
      <CardTitle title={intl.formatMessage(commonMessages.mainProductList)} />
      <CardContent>this is content</CardContent>
    </Card>
  );
};
