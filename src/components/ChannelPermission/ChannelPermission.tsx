import { ChannelFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { Box, Checkbox, Multiselect, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface ChannelPermissionProps {
  selectedChannels: string[];
  allChannels: ChannelFragment[];
  description?: string;
  hasAllChannels: boolean;
  disabled: boolean;
  disabledSelectAllChannels: boolean;
  onChannelChange: FormChange;
  onHasAllChannelsChange: () => void;
}

export const ChannelPermission = ({
  description,
  disabled,
  onHasAllChannelsChange,
  onChannelChange,
  allChannels,
  selectedChannels,
  hasAllChannels,
  disabledSelectAllChannels,
}: ChannelPermissionProps) => {
  const intl = useIntl();
  const channelsChoices = mapNodeToChoice(allChannels);

  return (
    <Box height="100%">
      <Text as="p" size={5} marginBottom={5}>
        {intl.formatMessage(messages.title)}
      </Text>

      <Box height="100%">
        {description && (
          <Text as="p" size={3} marginBottom={5}>
            {description}
          </Text>
        )}

        <Box __width="fit-content">
          <Checkbox
            disabled={disabled || disabledSelectAllChannels}
            checked={hasAllChannels}
            onCheckedChange={onHasAllChannelsChange}
            tabIndex={-1}
          >
            <Text>{intl.formatMessage(messages.allowAllChannels)}</Text>
          </Checkbox>
        </Box>

        {!hasAllChannels && (
          <Box marginTop={5}>
            <Multiselect
              size="small"
              data-test-id="channels"
              disabled={disabled}
              options={channelsChoices}
              label={intl.formatMessage(messages.selectChannels)}
              value={channelsChoices.filter(channel =>
                selectedChannels.includes(channel.value),
              )}
              placeholder={intl.formatMessage(messages.searchChannels)}
              onChange={values => {
                onChannelChange({
                  target: { name: "channels", value: values.map(v => v.value) },
                });
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
