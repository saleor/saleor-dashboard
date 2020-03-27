import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
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
import { WebhookCreate_webhookCreate_webhookErrors } from "@saleor/webhooks/types/WebhookCreate";
import { getFieldError } from "@saleor/utils/errors";
import { FormData } from "../WebhooksDetailsPage";

interface WebhookInfoProps {
  data: FormData;
  disabled: boolean;
  errors: WebhookCreate_webhookCreate_webhookErrors[];
  serviceDisplayValue: string;
  services: SingleAutocompleteChoiceType[];
  onChange: (event: React.ChangeEvent<any>) => void;
  serviceOnChange: (event: ChangeEvent) => void;
  fetchServiceAccounts: (data: string) => void;
}

const useStyles = makeStyles(
  () => ({
    status: {
      paddingTop: 20
    },
    title: {
      fontSize: 16,
      lineHeight: 1.9,
      paddingBottom: 10
    }
  }),
  { name: "WebhookInfo" }
);

const WebhookInfo: React.FC<WebhookInfoProps> = ({
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
    errors.filter(error => error.field === null).length > 0;

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
          error={!!getFieldError(errors, "name")}
          helperText={getFieldError(errors, "name")?.message}
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
          error={!!getFieldError(errors, "targetUrl")}
          helperText={
            getFieldError(errors, "targetUrl")?.message ||
            intl.formatMessage({
              defaultMessage: "This URL will receive webhook POST requests",
              description: "webhook target url help text"
            })
          }
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
          error={!!getFieldError(errors, "secretKey")}
          helperText={
            getFieldError(errors, "secretKey")?.message ||
            intl.formatMessage({
              defaultMessage:
                "secret key is used to create a hash signature with each payload. *optional field",
              description: "webhook secret key help text"
            })
          }
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
