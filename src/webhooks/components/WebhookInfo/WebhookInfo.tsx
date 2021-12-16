import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { WebhookErrorFragment } from "@saleor/fragments/types/WebhookErrorFragment";
import { commonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import getWebhookErrorMessage from "@saleor/utils/errors/webhooks";
import React from "react";
import { useIntl } from "react-intl";

import { WebhookFormData } from "../WebhooksDetailsPage/WebhooksDetailsPage";
import { messages } from "./messages";

interface WebhookInfoProps {
  data: WebhookFormData;
  disabled: boolean;
  errors: WebhookErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const WebhookInfo: React.FC<WebhookInfoProps> = ({
  data,
  disabled,
  errors,
  onChange
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["name", "targetUrl", "secretKey"], errors);

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.webhookInformation)} />
      <CardContent>
        <Typography variant="caption">
          {intl.formatMessage(commonMessages.generalInformations)}
        </Typography>
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!formErrors.name}
          helperText={getWebhookErrorMessage(formErrors.name, intl)}
          label={intl.formatMessage(messages.webhookName)}
          fullWidth
          name="name"
          value={data.name}
          onChange={onChange}
        />
        <FormSpacer />
        <Hr />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!formErrors.targetUrl}
          helperText={
            getWebhookErrorMessage(formErrors.targetUrl, intl) ||
            intl.formatMessage(messages.targetUrlDescription)
          }
          label={intl.formatMessage(messages.targetUrl)}
          fullWidth
          name="targetUrl"
          value={data.targetUrl}
          onChange={onChange}
        />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!formErrors.secretKey}
          helperText={
            getWebhookErrorMessage(formErrors.secretKey, intl) ||
            intl.formatMessage(messages.secretKeyDescription)
          }
          label={intl.formatMessage(messages.secretKey)}
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
