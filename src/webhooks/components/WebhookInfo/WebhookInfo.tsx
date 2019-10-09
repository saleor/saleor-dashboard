import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/styles/makeStyles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { commonMessages } from "@saleor/intl";
import { FormData } from "../WebhooksDetailsPage";

interface WebhookInfoProps {
  data: FormData;
  description: string;
  name: string;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(() => ({
  status: {
    paddingTop: 20
  },
  title: {
    fontSize: 14,
    paddingTop: 10
  }
}));

const WebhookInfo: React.StatelessComponent<WebhookInfoProps> = ({
  data,
  description,
  name,
  onChange
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Plugin Information and Status",
          description: "section header"
        })}
      />
      <CardContent></CardContent>
    </Card>
  );
};
WebhookInfo.displayName = "WebhookInfo";
export default WebhookInfo;
