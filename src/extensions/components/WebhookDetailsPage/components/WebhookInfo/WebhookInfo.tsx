import { DashboardCard } from "@dashboard/components/Card";
import FormSpacer from "@dashboard/components/FormSpacer";
import Hr from "@dashboard/components/Hr";
import Link from "@dashboard/components/Link";
import { WebhookErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getWebhookErrorMessage from "@dashboard/utils/errors/webhooks";
import { Box, Chip, Input, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { WebhookFormData } from "../../WebhookDetailsPage";
import WebhookStatus from "../WebhookStatus";
import { messages } from "./messages";
import { useStyles } from "./styles";

interface WebhookInfoProps {
  data: WebhookFormData;
  disabled: boolean;
  errors: WebhookErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
  setValue: (data: Partial<WebhookFormData>) => void;
}

const WebhookInfo: React.FC<WebhookInfoProps> = ({
  data,
  disabled,
  errors,
  onChange,
  setValue,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const formErrors = getFormErrors(["name", "targetUrl", "secretKey"], errors);

  return (
    <DashboardCard className={classes.card}>
      <DashboardCard.Header paddingLeft={0}>
        <DashboardCard.Title>{intl.formatMessage(messages.webhookInformation)}</DashboardCard.Title>
      </DashboardCard.Header>

      <DashboardCard.Content className={classes.card}>
        <Text fontWeight="medium" fontSize={3} display="block">
          {intl.formatMessage(commonMessages.generalInformations)}
        </Text>
        <FormSpacer />
        <Box marginBottom={3}>
          <WebhookStatus data={data.isActive} disabled={disabled} setValue={setValue} />
        </Box>

        <Input
          disabled={disabled}
          error={!!formErrors.name}
          helperText={getWebhookErrorMessage(formErrors.name, intl)}
          label={intl.formatMessage(messages.webhookName)}
          name="name"
          value={data.name}
          onChange={onChange}
        />
        <FormSpacer />
        <Hr />
        <FormSpacer />
        <Input
          disabled={disabled}
          error={!!formErrors.targetUrl}
          helperText={
            getWebhookErrorMessage(formErrors.targetUrl, intl) ||
            intl.formatMessage(messages.targetUrlDescription)
          }
          label={intl.formatMessage(messages.targetUrl)}
          name="targetUrl"
          value={data.targetUrl}
          onChange={onChange}
        />
        <FormSpacer />
        <Input
          disabled={disabled}
          error={!!formErrors.secretKey}
          helperText={
            getWebhookErrorMessage(formErrors.secretKey, intl) ||
            intl.formatMessage(messages.secretKeyDescription)
          }
          label={intl.formatMessage(messages.secretKey)}
          name="secretKey"
          value={data.secretKey}
          onChange={onChange}
          endAdornment={
            <Tooltip>
              <Tooltip.Trigger>
                <Chip
                  backgroundColor="critical1"
                  borderColor="critical1"
                  color="critical1"
                  size="medium"
                  style={{ cursor: "pointer" }}
                >
                  {intl.formatMessage(commonMessages.deprecated)}
                </Chip>
              </Tooltip.Trigger>
              <Tooltip.Content side="top">
                <Tooltip.Arrow />
                <Box
                  backgroundColor="critical1"
                  padding={4}
                  borderRadius={2}
                  style={{ minWidth: 200 }}
                >
                  <Text fontWeight="bold" color="default1" marginBottom={2}>
                    <FormattedMessage defaultMessage="Deprecated" id="z9c6/C" />
                  </Text>
                  <Box display="flex" gap={1} alignItems="center">
                    <Text color="default1">
                      <FormattedMessage {...messages.useSignature} />
                    </Text>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://docs.saleor.io/docs/3.x/developer/extending/apps/synchronous-webhooks/key-concepts#payload-signature"
                    >
                      <FormattedMessage {...messages.learnMore} />
                    </Link>
                  </Box>
                </Box>
              </Tooltip.Content>
            </Tooltip>
          }
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

WebhookInfo.displayName = "WebhookInfo";
export default WebhookInfo;
