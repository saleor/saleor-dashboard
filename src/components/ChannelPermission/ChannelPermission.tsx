import { ChannelFragment } from "@dashboard/graphql";
import { useChannelsSearch } from "@dashboard/hooks/useChannelsSearch";
import { FormChange } from "@dashboard/hooks/useForm";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { Box, Checkbox, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType,
} from "../MultiAutocompleteSelectField";
import { messages } from "./messages";

interface ChannelPermissionProps {
  selectedChannels: MultiAutocompleteChoiceType[];
  allChannels: ChannelFragment[];
  description?: string;
  hasAllChannels: boolean;
  disabled: boolean;
  disabledSelectAllChannls: boolean;
  onChannelChange: FormChange;
  onHasAllChannelsChange: () => void;
}

const MIN_CHANNELS_AMOUNT = 0;

export const ChannelPermission = ({
  description,
  disabled,
  onHasAllChannelsChange,
  onChannelChange,
  allChannels,
  selectedChannels,
  disabledSelectAllChannls,
  hasAllChannels,
}: ChannelPermissionProps) => {
  const intl = useIntl();

  const { onQueryChange, filteredChannels } = useChannelsSearch(allChannels);

  return (
    <Box height="100%" overflow="hidden" paddingX={9} paddingY={9}>
      <Text as="p" variant="bodyEmp" size="large" marginBottom={7}>
        {intl.formatMessage(messages.title)}
      </Text>
      <Box height="100%">
        {description && (
          <Text as="p" variant="body" size="small" marginBottom={5}>
            {description}
          </Text>
        )}
        {filteredChannels.length > MIN_CHANNELS_AMOUNT && (
          <Checkbox
            disabled={disabled || disabledSelectAllChannls}
            checked={hasAllChannels}
            onCheckedChange={onHasAllChannelsChange}
            tabIndex={-1}
          >
            <Text variant="body">
              {intl.formatMessage(messages.allowAllChannels)}
            </Text>
          </Checkbox>
        )}
        {(!hasAllChannels || disabledSelectAllChannls) &&
          filteredChannels.length > MIN_CHANNELS_AMOUNT && (
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
        {(!hasAllChannels || disabledSelectAllChannls) && (
          <Box __height="100%" overflowY="scroll" overflowX="hidden">
            <MultiAutocompleteSelectField
              disabled={disabled}
              choices={mapNodeToChoice(filteredChannels)}
              displayValues={selectedChannels}
              fetchChoices={onQueryChange}
              hasMore={false}
              label={intl.formatMessage(messages.selectChannels)}
              loading={false}
              name="channels"
              onChange={onChannelChange}
              placeholder={intl.formatMessage(messages.searchChannels)}
              value={selectedChannels.map(channel => channel.value)}
              testId="channels"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
