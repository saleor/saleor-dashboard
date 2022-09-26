import {
  Card,
  CardContent,
  Popper,
  TextField,
  Typography,
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import Link from "@saleor/components/Link";
import { WebhookErrorFragment } from "@saleor/graphql";
import { commonMessages } from "@saleor/intl";
import { Pill } from "@saleor/macaw-ui";
import { getFormErrors } from "@saleor/utils/errors";
import getWebhookErrorMessage from "@saleor/utils/errors/webhooks";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { WebhookFormData } from "../WebhooksDetailsPage/WebhooksDetailsPage";
import { messages } from "./messages";
import { useStyles } from "./styles";

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
  onChange,
}) => {
  const intl = useIntl();
  const classes = useStyles();

  const formErrors = getFormErrors(["name", "targetUrl", "secretKey"], errors);

  const [isPopupOpen, setPopupOpen] = React.useState(false);
  const anchor = React.useRef<HTMLDivElement>(null);

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
          InputProps={{
            endAdornment: (
              <div
                ref={anchor}
                onMouseOver={() => setPopupOpen(true)}
                onMouseLeave={() => setPopupOpen(false)}
              >
                <Pill
                  label={intl.formatMessage(commonMessages.deprecated)}
                  color={"error"}
                  outlined
                  size="small"
                />
                <Popper
                  anchorEl={anchor.current}
                  open={isPopupOpen}
                  placement={"top"}
                >
                  <Card elevation={8} className={classes.toolbar}>
                    <Typography>
                      <FormattedMessage {...messages.useSignature} />
                    </Typography>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://docs.saleor.io/docs/3.x/developer/extending/apps/synchronous-webhooks/key-concepts#payload-signature"
                    >
                      <FormattedMessage {...messages.learnMore} />
                    </Link>
                  </Card>
                </Popper>
              </div>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};
WebhookInfo.displayName = "WebhookInfo";
export default WebhookInfo;
