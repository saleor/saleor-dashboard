import { WARNING_ICON_COLOR } from "@dashboard/colors";
import Link from "@dashboard/components/Link";
import { infoMessages } from "@dashboard/extensions/messages";
import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface FailedWebhookInfoProps {
  date: string;
  link: string;
}

export const FailedWebhookInfo = ({ date, link }: FailedWebhookInfoProps) => {
  return (
    <Box display="flex" alignItems="center" gap={1} color="default2">
      <Box __color={WARNING_ICON_COLOR} display="flex" alignItems="center" justifyContent="center">
        <ExclamationIcon width="11px" height="11px" />
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <Text size={2} color="default2">
          <FormattedMessage {...infoMessages.webhookErrorDetected} />
        </Text>
        <Text size={2} color="default2">
          <FormattedMessage
            {...infoMessages.webhookErrorLastSeen}
            values={{
              date,
            }}
          />
        </Text>
        <Link href={link} color="secondary">
          <Text
            size={2}
            color="default2"
            textDecoration="underline"
            style={{
              textUnderlineOffset: "2px",
            }}
          >
            <FormattedMessage {...infoMessages.webhookErrorViewDetails} />
          </Text>
        </Link>
      </Box>
    </Box>
  );
};
