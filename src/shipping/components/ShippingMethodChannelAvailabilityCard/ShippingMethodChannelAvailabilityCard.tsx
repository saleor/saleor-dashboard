import { type ChannelShippingData, sortChannelShippingDataByName } from "@dashboard/channels/utils";
import { ChannelAvailabilityCard } from "@dashboard/components/ChannelAvailability/ChannelAvailabilityCard";
import {
  type ChannelAvailabilityStatus,
  type ChannelAvailabilitySummary,
} from "@dashboard/components/ChannelAvailability/types";
import { type PermissionEnum, type ShippingChannelsErrorFragment } from "@dashboard/graphql";
import {
  hasMissingChannelPrices,
  isDraftShippingChannel,
} from "@dashboard/shipping/utils/channelPricingState";
import {
  type ChannelError,
  getFormChannelError,
  getFormChannelErrors,
} from "@dashboard/utils/errors";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";

interface ShippingMethodChannelAvailabilityCardProps {
  channels: ChannelShippingData[];
  savedChannelIds?: string[];
  pricedChannelIds?: string[];
  totalChannelsCount: number;
  errors: ShippingChannelsErrorFragment[];
  isLoading?: boolean;
  managePermissions: PermissionEnum[];
  onManageClick: () => void;
}

const messages = defineMessages({
  emptyMessage: {
    id: "2ZDnTL",
    defaultMessage: "This shipping rate is not available in any channel",
    description: "empty state for shipping method channel availability",
  },
  statusConfigured: {
    id: "gxlfwl",
    defaultMessage: "Configured",
    description: "shipping method channel status when price is set",
  },
  statusConfiguredDescription: {
    id: "vg2Rv4",
    defaultMessage: "Price is set for this channel",
    description: "shipping method channel status description when configured",
  },
  statusMissingPrice: {
    id: "pX2Khx",
    defaultMessage: "Missing price",
    description: "shipping method channel status when price is not set",
  },
  statusMissingPriceDescription: {
    id: "cBrkEM",
    defaultMessage: "Set a price in the Pricing section to enable this rate",
    description: "shipping method channel status description when price missing",
  },
  statusDraft: {
    id: "ffvXcE",
    defaultMessage: "Draft",
    description: "shipping method channel status when newly added",
  },
  statusDraftDescription: {
    id: "2kJxEe",
    defaultMessage: "Set a price in the Pricing section before saving",
    description: "shipping method channel status description when newly added",
  },
  missingPricesBanner: {
    id: "qP8fZq",
    defaultMessage:
      "{count, plural, one {# channel is missing a price} other {# channels are missing a price}}",
    description: "banner when shipping method channels are missing prices",
  },
  draftChannelsBanner: {
    id: "ijPI0J",
    defaultMessage:
      "{count, plural, one {# new channel needs a price before saving} other {# new channels need a price before saving}}",
    description: "banner when newly added shipping method channels need prices",
  },
  allChannelsConfigured: {
    id: "P7JWlP",
    defaultMessage: "All channels have prices set",
    description: "banner when all shipping method channels are configured",
  },
});

const toChannelSummary = (channel: ChannelShippingData): ChannelAvailabilitySummary => ({
  id: channel.id,
  name: channel.name,
  currencyCode: channel.currency,
});

const isMissingPrice = (channel: ChannelShippingData) => hasMissingChannelPrices([channel]);

export const ShippingMethodChannelAvailabilityCard = ({
  channels,
  savedChannelIds = [],
  pricedChannelIds = [],
  totalChannelsCount,
  errors,
  isLoading,
  managePermissions,
  onManageClick,
}: ShippingMethodChannelAvailabilityCardProps) => {
  const intl = useIntl();
  const priceErrors = getFormChannelErrors(["price"], errors as ChannelError[]);
  const sortedChannels = useMemo(() => sortChannelShippingDataByName(channels), [channels]);
  const channelSummaries = sortedChannels.map(toChannelSummary);
  const savedChannelIdSet = useMemo(() => new Set(savedChannelIds), [savedChannelIds]);
  const pricedChannelIdSet = useMemo(() => new Set(pricedChannelIds), [pricedChannelIds]);

  const savedChannelsMissingPrice = sortedChannels.filter(
    channel => savedChannelIdSet.has(channel.id) && isMissingPrice(channel),
  ).length;
  const draftChannelsMissingPrice = sortedChannels.filter(
    channel =>
      isDraftShippingChannel(channel.id, savedChannelIdSet, pricedChannelIdSet) &&
      isMissingPrice(channel),
  ).length;
  const newChannelsMissingPriceAfterEntry = sortedChannels.filter(
    channel =>
      !savedChannelIdSet.has(channel.id) &&
      pricedChannelIdSet.has(channel.id) &&
      isMissingPrice(channel),
  ).length;
  const channelsMissingPriceCount = savedChannelsMissingPrice + newChannelsMissingPriceAfterEntry;

  const getChannelStatus = (
    channelSummary: ChannelAvailabilitySummary,
  ): ChannelAvailabilityStatus => {
    const channel = sortedChannels.find(item => item.id === channelSummary.id);

    if (!channel) {
      return {
        type: "error",
        label: intl.formatMessage(messages.statusMissingPrice),
        description: intl.formatMessage(messages.statusMissingPriceDescription),
        badge: "error",
      };
    }

    const hasPriceError =
      isMissingPrice(channel) || !!getFormChannelError(priceErrors.price, channel.id);

    if (hasPriceError) {
      if (isDraftShippingChannel(channel.id, savedChannelIdSet, pricedChannelIdSet)) {
        return {
          type: "warning",
          label: intl.formatMessage(messages.statusDraft),
          description: intl.formatMessage(messages.statusDraftDescription),
          badge: "draft",
        };
      }

      return {
        type: "error",
        label: intl.formatMessage(messages.statusMissingPrice),
        description: intl.formatMessage(messages.statusMissingPriceDescription),
        badge: "error",
      };
    }

    return {
      type: "success",
      label: intl.formatMessage(messages.statusConfigured),
      description: intl.formatMessage(messages.statusConfiguredDescription),
    };
  };

  const banner =
    channelsMissingPriceCount > 0 ? (
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          borderRadius="100%"
          __width="8px"
          __height="8px"
          __backgroundColor="var(--mu-colors-background-critical1)"
          flexShrink="0"
        />
        <Text size={2} color="critical1" data-test-id="shipping-channel-missing-price-banner">
          {intl.formatMessage(messages.missingPricesBanner, { count: channelsMissingPriceCount })}
        </Text>
      </Box>
    ) : draftChannelsMissingPrice > 0 ? (
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          borderRadius="100%"
          __width="8px"
          __height="8px"
          __backgroundColor="var(--mu-colors-background-warning1)"
          flexShrink="0"
        />
        <Text size={2} color="warning1" data-test-id="shipping-channel-draft-banner">
          {intl.formatMessage(messages.draftChannelsBanner, { count: draftChannelsMissingPrice })}
        </Text>
      </Box>
    ) : (
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          borderRadius="100%"
          __width="8px"
          __height="8px"
          __backgroundColor="var(--mu-colors-background-success1)"
          flexShrink="0"
        />
        <Text size={2} color="default2" data-test-id="shipping-channel-healthy-banner">
          {intl.formatMessage(messages.allChannelsConfigured)}
        </Text>
      </Box>
    );

  return (
    <ChannelAvailabilityCard
      variant="list"
      listLeadingVisual="channel-icon"
      channels={channelSummaries}
      totalChannelsCount={totalChannelsCount}
      emptyMessage={intl.formatMessage(messages.emptyMessage)}
      isLoading={isLoading}
      onManageClick={onManageClick}
      managePermissions={managePermissions}
      banner={sortedChannels.length > 0 ? banner : undefined}
      getChannelStatus={getChannelStatus}
    />
  );
};

ShippingMethodChannelAvailabilityCard.displayName = "ShippingMethodChannelAvailabilityCard";
