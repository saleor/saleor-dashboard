import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/styles/makeStyles";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { FormErrors } from "@saleor/types";
import { FormData } from "../WebhooksDetailsPage";

import { ServiceList_serviceAccounts_edges_node } from "../../types/ServiceList";

interface WebhookInfoProps {
  data: FormData;
  disabled: boolean;
  services: ServiceList_serviceAccounts_edges_node[];
  errors: FormErrors<"name" | "targetUrl" | "secretKey">;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(() => ({
  status: {
    paddingTop: 20
  },
  title: {
    fontSize: 16,
    lineHeight: 1.9,
    paddingBottom: 10
  }
}));

const WebhookInfo: React.StatelessComponent<WebhookInfoProps> = ({
  data,
  disabled,
  services,
  errors,
  onChange
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Webhook Information",
          description: "section header"
        })}
      />
      <CardContent>
        <Typography className={classes.title}>
          {intl.formatMessage({
            defaultMessage: "General Information",
            description: "webhook general information"
          })}
        </Typography>
        <TextField
          disabled={disabled}
          error={!!errors.name}
          helperText={errors.name}
          label={intl.formatMessage({
            defaultMessage: "Webhook Name",
            description: "webhook"
          })}
          fullWidth
          name="name"
          value={data.name}
          onChange={onChange}
        />
        <FormSpacer />
        <Hr />
        <FormSpacer />
        <Typography className={classes.title}>
          {intl.formatMessage({
            defaultMessage: "Webhook specific information",
            description: "webhook specific information"
          })}
        </Typography>
        <SingleSelectField
          choices={services.map(service => ({
            label: service.name,
            value: service.id
          }))}
          name="serviceAccount"
          value={data.serviceAccount}
          label={intl.formatMessage({
            defaultMessage: "Assign to Service Account"
          })}
          onChange={onChange}
        />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!errors.targetUrl}
          helperText={intl.formatMessage({
            defaultMessage: "This URL will recieve webhook POST requests",
            description: "webhook target url help text"
          })}
          label={intl.formatMessage({
            defaultMessage: "Target URL",
            description: "webhook"
          })}
          fullWidth
          name="targetUrl"
          value={data.targetUrl}
          onChange={onChange}
        />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!errors.secretKey}
          helperText={intl.formatMessage({
            defaultMessage:
              "secret key is used to create a hash signature with each payload. *optional field",
            description: "webhook secret key help text"
          })}
          label={intl.formatMessage({
            defaultMessage: "Secrect Key",
            description: "webhook"
          })}
          fullWidth
          name="secretKey"
          value={data.secretKey}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
WebhookInfo.displayName = "WebhookInfo";
export default WebhookInfo;
