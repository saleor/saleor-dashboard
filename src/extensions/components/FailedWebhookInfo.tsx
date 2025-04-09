import { WARNING_ICON_COLOR } from "@dashboard/colors";
import Link from "@dashboard/components/Link";
import { infoMessages } from "@dashboard/extensions/messages";
import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import { Box, Text } from "@saleor/macaw-ui-next";
import moment from "moment-timezone";
import React from "react";
import { FormattedMessage } from "react-intl";

interface FailedWebhookInfoProps {
  date: moment.Moment;
  link: string;
}

const alignVeritically = { verticalAlign: "baseline" };

export const FailedWebhookInfo = ({ date, link }: FailedWebhookInfoProps) => {
  return (
    <Box display="flex" alignItems="center" gap={1} color="default2">
      <Box __color={WARNING_ICON_COLOR} display="flex" alignItems="center" justifyContent="center">
        <ExclamationIcon width="11px" height="11px" />
      </Box>
      <Box
        display={{
          desktop: "block",
          tablet: "block",
          mobile: "none",
        }}
      >
        <Text size={2} color="default2" style={alignVeritically}>
          <FormattedMessage {...infoMessages.webhookErrorDetected} />
        </Text>{" "}
        <Text size={2} color="default2" style={alignVeritically}>
          <FormattedMessage
            {...infoMessages.webhookErrorLastSeen}
            values={{
              date: date.format("LLL"),
            }}
          />
        </Text>{" "}
        <Link href={link} color="secondary" style={alignVeritically}>
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
