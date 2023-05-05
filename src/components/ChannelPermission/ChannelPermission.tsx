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

interface ChannelPermissionProps {
  selectedChannels: string[];
  allChannels: ChannelFragment[];
  channelsDisplayValues: MultiAutocompleteChoiceType[];
  description?: string;
  hasRestrictedChannels: boolean;
  disabled: boolean;
  onChannelChange: FormChange;
  onHasRestrictedChannelsChange: () => void;
}

export const ChannelPermission = ({
  description,
  disabled,
  onHasRestrictedChannelsChange,
  onChannelChange,
  channelsDisplayValues,
  allChannels,
  selectedChannels,
  hasRestrictedChannels,
}: ChannelPermissionProps) => {
  const intl = useIntl();

  const { onQueryChange, filteredChannels } = useChannelsSearch(allChannels);

  return (
    <Box height="100%" overflow="hidden" paddingX={9} paddingY={9}>
      <Text as="p" variant="bodyEmp" size="large" marginBottom={7}>
        {intl.formatMessage({
          defaultMessage: "Channels permissions",
          id: "vz3yxp",
        })}
      </Text>
      <Box height="100%">
        {description && (
          <Text as="p" variant="body" size="small" marginBottom={5}>
            {description}
          </Text>
        )}

        <Checkbox
          checked={!hasRestrictedChannels}
          onCheckedChange={onHasRestrictedChannelsChange}
          disabled={disabled}
          tabIndex={-1}
        >
          <Text variant="body">
            {intl.formatMessage({
              defaultMessage: "Allow access to all channels",
              id: "B/TEDt",
            })}
          </Text>
        </Checkbox>

        {hasRestrictedChannels && (
          <>
            <Box
              width="100%"
              borderBottomStyle="solid"
              borderBottomWidth={1}
              borderColor="neutralPlain"
              height={1}
              marginTop={9}
              marginBottom={9}
            />
            <Box
              __height="calc(100% - 115px)"
              overflowY="scroll"
              overflowX="hidden"
            >
              <MultiAutocompleteSelectField
                disabled={disabled}
                choices={mapNodeToChoice(filteredChannels)}
                displayValues={channelsDisplayValues}
                fetchChoices={onQueryChange}
                hasMore={false}
                label={intl.formatMessage({
                  defaultMessage: "Select visible channels",
                  id: "xGknjS",
                })}
                loading={false}
                name="channels"
                onChange={onChannelChange}
                placeholder={intl.formatMessage({
                  defaultMessage: "Search channels",
                  id: "0HBlkO",
                })}
                value={selectedChannels}
                testId="channels"
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
