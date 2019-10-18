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
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType
} from "@saleor/components/SingleAutocompleteSelectField";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { commonMessages } from "@saleor/intl";
import { FormErrors } from "@saleor/types";
import { WebhookCreate_webhookCreate_webhookErrors } from "@saleor/webhooks/types/WebhookCreate";
import { FormData } from "../WebhooksDetailsPage";

interface WebhookInfoProps {
  apiErrors: WebhookCreate_webhookCreate_webhookErrors[];
  data: FormData;
  disabled: boolean;
  serviceDisplayValue: string;
  services: SingleAutocompleteChoiceType[];
  errors: FormErrors<"name" | "targetUrl" | "secretKey">;
  onChange: (event: React.ChangeEvent<any>) => void;
  serviceOnChange: (event: ChangeEvent) => void;
  fetchServiceAccounts: (data: string) => void;
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
  apiErrors,
  data,
  disabled,
  services,
  serviceDisplayValue,
  fetchServiceAccounts,
  errors,
  onChange,
  serviceOnChange
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const serviceAccountsError =
    apiErrors.filter(error => error.field === null).length > 0;

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
          {intl.formatMessage(commonMessages.generalInformations)}
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
        <SingleAutocompleteSelectField
          disabled={disabled}
          displayValue={serviceDisplayValue}
          label={intl.formatMessage({
            defaultMessage: "Assign to Service Account"
          })}
          error={serviceAccountsError}
          helperText={
            serviceAccountsError &&
            intl.formatMessage(commonMessages.requiredField)
          }
          name="serviceAccount"
          onChange={serviceOnChange}
          value={data.serviceAccount}
          choices={services}
          fetchChoices={fetchServiceAccounts}
          InputProps={{
            autoComplete: "off"
          }}
        />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!errors.targetUrl}
          helperText={intl.formatMessage({
            defaultMessage: "This URL will receive webhook POST requests",
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
