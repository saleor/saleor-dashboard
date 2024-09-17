import Label from "@dashboard/orders/components/OrderHistory/Label";
import { Box, Checkbox, Divider, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

const messages = defineMessages({
  selectTitle: {
    id: "7scATx",
    defaultMessage: "Select channels you want for {contentType} to be available on",
    description: "select title",
  },
  selectAllChannelsLabel: {
    id: "zR9Ozi",
    defaultMessage: "Select All Channels",
    description: "select all channels label",
  },
  channelsAlphabeticallyTitle: {
    id: "/lBLBI",
    defaultMessage: "Channels from A to Z",
    description: "channels alphabetically title",
  },
  notFoundTitle: {
    id: "PctLol",
    defaultMessage: "No Channels Found",
    description: "no channels found title",
  },
});

export interface ChannelsAvailabilityContentProps {
  contentType?: string;
  toggleAll?: () => void;
  children: React.ReactNode;
  toggleAllLabel?: React.ReactNode;
  query: string;
  onQueryChange: (query: string) => void;
  hasAnyChannelsToDisplay: boolean;
  hasAllSelected: boolean;
}

export const ChannelsAvailabilityContentWrapper: React.FC<ChannelsAvailabilityContentProps> = ({
  contentType = "",
  toggleAll,
  toggleAllLabel,
  children,
  hasAnyChannelsToDisplay,
  query,
  onQueryChange,
  hasAllSelected,
}) => {
  const intl = useIntl();
  const searchText = intl.formatMessage({
    id: "ybaLoZ",
    defaultMessage: "Search through channels",
  });

  return (
    <Box __maxHeight="calc(-260px + 100vh)">
      {!!contentType && (
        <Text marginBottom={5} size={2} fontWeight="light">
          <FormattedMessage {...messages.selectTitle} />
        </Text>
      )}
      <Input
        name="query"
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        label={searchText}
        placeholder={searchText}
        width="100%"
      />
      <div>
        {!!toggleAll && (
          <>
            <Checkbox
              checked={hasAllSelected}
              name="allChannels"
              data-test-id="all-channels"
              onCheckedChange={toggleAll}
              paddingY={4}
            >
              {toggleAllLabel ?? (
                <Label text={intl.formatMessage(messages.selectAllChannelsLabel)} />
              )}
            </Checkbox>
            <Divider __marginLeft="-24px" __width="calc(100% + 48px)" />
          </>
        )}
        <Text marginTop={2} marginBottom={3} fontWeight="bold" display="block">
          <FormattedMessage {...messages.channelsAlphabeticallyTitle} />
        </Text>
        <Box
          data-test-id="manage-products-channels-availiability-list"
          __marginLeft="-24px"
          __marginRight="-24px"
          __paddingLeft="24px"
          overflowY="scroll"
          overflowX="hidden"
          __maxHeight="calc(100vh - 400px)"
        >
          {hasAnyChannelsToDisplay ? (
            children
          ) : (
            <Box paddingBottom={4}>
              <FormattedMessage {...messages.notFoundTitle} />
            </Box>
          )}
        </Box>
      </div>
    </Box>
  );
};

export default ChannelsAvailabilityContentWrapper;
