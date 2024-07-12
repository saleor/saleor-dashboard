import { DashboardCard } from "@dashboard/components/Card";
import FormSpacer from "@dashboard/components/FormSpacer";
import Hr from "@dashboard/components/Hr";
import Link from "@dashboard/components/Link";
import { Pill } from "@dashboard/components/Pill";
import { WebhookErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getWebhookErrorMessage from "@dashboard/utils/errors/webhooks";
import { Popper, TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { WebhookFormData } from "../WebhookDetailsPage";
import { messages } from "./messages";
import { useStyles } from "./styles";

interface WebhookInfoProps {
  data: WebhookFormData;
  disabled: boolean;
  errors: WebhookErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const WebhookInfo: React.FC<WebhookInfoProps> = ({ data, disabled, errors, onChange }) => {
  const intl = useIntl();
  const classes = useStyles();
  const formErrors = getFormErrors(["name", "targetUrl", "secretKey"], errors);
  const [isPopupOpen, setPopupOpen] = React.useState(false);
  const anchor = React.useRef<HTMLDivElement>(null);

  return (
    <DashboardCard className={classes.card}>
      <DashboardCard.Title className={classes.cardTitle}>
        {intl.formatMessage(messages.webhookInformation)}
      </DashboardCard.Title>

      <DashboardCard.Content className={classes.card}>
        <Text size={2} fontWeight="light">
          {intl.formatMessage(commonMessages.generalInformations)}
        </Text>
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
                <Popper anchorEl={anchor.current} open={isPopupOpen} placement={"top"}>
                  <DashboardCard boxShadow="defaultModal" className={classes.toolbar}>
                    <Text>
                      <FormattedMessage {...messages.useSignature} />
                    </Text>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://docs.saleor.io/docs/3.x/developer/extending/apps/synchronous-webhooks/key-concepts#payload-signature"
                    >
                      <FormattedMessage {...messages.learnMore} />
                    </Link>
                  </DashboardCard>
                </Popper>
              </div>
            ),
          }}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

WebhookInfo.displayName = "WebhookInfo";
export default WebhookInfo;
