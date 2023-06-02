import { ChannelFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { Box, Checkbox, Multiselect, Text } from "@saleor/macaw-ui/next";
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

  return (
    <Box
      height="100%"
      paddingX={9}
      paddingY={9}
      paddingTop={9}
      paddingBottom={0}
    >
      <Text as="p" variant="bodyEmp" size="large" marginBottom={7}>
        {intl.formatMessage(messages.title)}
      </Text>

      <Box height="100%">
        {description && (
          <Text as="p" variant="body" size="small" marginBottom={5}>
            {description}
          </Text>
        )}

        <Checkbox
          disabled={disabled || disabledSelectAllChannels}
          checked={hasAllChannels}
          onCheckedChange={onHasAllChannelsChange}
          tabIndex={-1}
        >
          <Text variant="body">
            {intl.formatMessage(messages.allowAllChannels)}
          </Text>
        </Checkbox>

        {!hasAllChannels && (
          <Box
            width="100%"
            borderBottomStyle="solid"
            borderBottomWidth={1}
            borderColor="neutralPlain"
            height={1}
            marginTop={9}
            marginBottom={9}
          />
        )}

        {!hasAllChannels && (
          <Box __height="calc(100% - 150px)" overflowY="auto">
            <Multiselect
              data-test-id="channels"
              disabled={disabled}
              options={mapNodeToChoice(allChannels)}
              label={intl.formatMessage(messages.selectChannels)}
              value={selectedChannels}
              placeholder={intl.formatMessage(messages.searchChannels)}
              onChange={values => {
                onChannelChange({
                  target: { name: "channels", value: values },
                });
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
