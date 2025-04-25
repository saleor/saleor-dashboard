import { WARNING_ICON_COLOR } from "@dashboard/colors";
import EventTime from "@dashboard/components/EventTime";
import Link from "@dashboard/components/Link";
import { infoMessages } from "@dashboard/extensions/messages";
import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { InfoLabelsContainer } from "../InfoLabels/InfoLabelsContainer";

interface FailedWebhookInfoProps {
  date: string;
  link: string;
}

const failedWebhookInfo = { verticalAlign: "baseline" };

export const FailedWebhookInfo = ({ date, link }: FailedWebhookInfoProps) => {
  return (
    <InfoLabelsContainer
      icon={
        <Box
          __color={WARNING_ICON_COLOR}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <ExclamationIcon />
        </Box>
      }
      message={
        <>
          <Text size={2} color="default2" style={failedWebhookInfo}>
            <FormattedMessage {...infoMessages.webhookErrorDetected} />
          </Text>{" "}
          <Text size={2} color="default2" style={failedWebhookInfo}>
            <FormattedMessage
              {...infoMessages.webhookErrorLastSeen}
              values={{
                date: <EventTime date={date} showSeconds />,
              }}
            />
          </Text>{" "}
          <Link href={link} color="secondary" style={failedWebhookInfo}>
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
        </>
      }
    />
  );
};
