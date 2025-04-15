import { WARNING_ICON_COLOR } from "@dashboard/colors";
import Link from "@dashboard/components/Link";
import { infoMessages } from "@dashboard/extensions/messages";
import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import { Box, Text } from "@saleor/macaw-ui-next";
import moment from "moment-timezone";
import React from "react";
import { FormattedMessage } from "react-intl";

import { InfoLabelsContainer } from "../InfoLabels/InfoLabelsContainer";

interface FailedWebhookInfoProps {
  date: moment.Moment;
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
                date: date.format("LLL"),
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
