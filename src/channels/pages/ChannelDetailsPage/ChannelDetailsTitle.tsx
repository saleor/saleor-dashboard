import { Pill } from "@dashboard/components/Pill";
import { type ChannelDetailsFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface ChannelDetailsTitleProps {
  channel: ChannelDetailsFragment;
}

export const ChannelDetailsTitle = ({ channel }: ChannelDetailsTitleProps): ReactNode => {
  const intl = useIntl();
  const statusLabel = intl.formatMessage(
    channel.isActive ? messages.statusActive : messages.statusInactive,
  );

  return (
    <Box display="flex" alignItems="center" gap={2} flexWrap="nowrap" __minWidth="0">
      <Box
        title={channel.name}
        __maxWidth="320px"
        __overflow="hidden"
        __textOverflow="ellipsis"
        __whiteSpace="nowrap"
        __minWidth="0"
      >
        {channel.name}
      </Box>
      <Pill
        data-test-id="channel-status-info"
        label={statusLabel}
        color={channel.isActive ? "success" : "neutral"}
      />
      <Text
        color="default2"
        fontSize={2}
        __whiteSpace="nowrap"
        display={{ mobile: "none", tablet: "block", desktop: "block" }}
      >
        <FormattedMessage
          {...messages.headerCountryCurrency}
          values={{
            country: channel.defaultCountry.country,
            currency: channel.currencyCode,
          }}
        />
      </Text>
    </Box>
  );
};
