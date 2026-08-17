import { type ChannelCollectionData } from "@dashboard/channels/utils";
import { ChannelAvailabilityCard } from "@dashboard/components/ChannelAvailability/ChannelAvailabilityCard";
import {
  type ChannelAvailabilityStatus,
  type ChannelAvailabilitySummary,
} from "@dashboard/components/ChannelAvailability/types";
import {
  type CollectionChannelListingErrorFragment,
  type PermissionEnum,
} from "@dashboard/graphql";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { isFutureDate } from "@dashboard/utils/date/isFutureDate";
import { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";

import { CollectionChannelVisibilitySection } from "./CollectionChannelVisibilitySection";

interface CollectionChannelAvailabilityCardProps {
  channels: ChannelCollectionData[];
  savedChannelListings?: ChannelCollectionData[];
  channelCurrencies: Record<string, string>;
  totalChannelsCount: number;
  errors: CollectionChannelListingErrorFragment[];
  disabled?: boolean;
  managePermissions: PermissionEnum[];
  onManageClick: () => void;
  onChannelChange: (id: string, data: { isPublished: boolean; publishedAt: string | null }) => void;
}

const messages = defineMessages({
  emptyDescription: {
    id: "o+aRjV",
    defaultMessage: "Assign channels so this collection can appear in storefronts.",
    description: "collection channel availability empty state description",
  },
  statusVisible: {
    id: "Hpd7i6",
    defaultMessage: "Visible",
    description: "collection channel status when published",
  },
  statusVisibleDescription: {
    id: "nkCi/+",
    defaultMessage: "Collection is visible in this channel",
    description: "collection channel status description when visible",
  },
  statusHidden: {
    id: "AMa5Mi",
    defaultMessage: "Hidden",
    description: "collection channel status when not published",
  },
  statusHiddenDescription: {
    id: "eiRboK",
    defaultMessage: "Collection is hidden in this channel",
    description: "collection channel status description when hidden",
  },
  statusScheduled: {
    id: "m14laH",
    defaultMessage: "Scheduled",
    description: "collection channel status when publication is scheduled",
  },
  statusScheduledDescription: {
    id: "XDumOI",
    defaultMessage: "Collection will become visible on {date}",
    description: "collection channel status description when scheduled",
  },
  statusPublishedAtError: {
    id: "12DAFh",
    defaultMessage: "Publication date error",
    description: "collection channel status when publishedAt field has an error",
  },
  statusPublishedAtErrorDescription: {
    id: "BGQRiO",
    defaultMessage: "Fix the publication date for this channel",
    description: "collection channel status description when publishedAt has an error",
  },
});

const toChannelSummary = (
  channel: ChannelCollectionData,
  channelCurrencies: Record<string, string>,
): ChannelAvailabilitySummary => ({
  id: channel.id,
  name: channel.name,
  currencyCode: channelCurrencies[channel.id] ?? "",
});

export const CollectionChannelAvailabilityCard = ({
  channels,
  savedChannelListings = [],
  channelCurrencies,
  totalChannelsCount,
  errors,
  disabled,
  managePermissions,
  onManageClick,
  onChannelChange,
}: CollectionChannelAvailabilityCardProps) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();
  const sortedChannels = useMemo(
    () =>
      [...channels].sort((channel, nextChannel) => channel.name.localeCompare(nextChannel.name)),
    [channels],
  );
  const channelSummaries = sortedChannels.map(channel =>
    toChannelSummary(channel, channelCurrencies),
  );

  const getChannelStatus = (
    channelSummary: ChannelAvailabilitySummary,
  ): ChannelAvailabilityStatus => {
    const channel = sortedChannels.find(item => item.id === channelSummary.id);

    if (!channel) {
      return {
        type: "error",
        label: intl.formatMessage(messages.statusHidden),
        description: intl.formatMessage(messages.statusHiddenDescription),
        badge: "error",
      };
    }

    const hasPublishedAtError = errors.some(
      error => error.field === "publishedAt" && error.channels?.includes(channel.id),
    );

    if (hasPublishedAtError) {
      return {
        type: "error",
        label: intl.formatMessage(messages.statusPublishedAtError),
        description: intl.formatMessage(messages.statusPublishedAtErrorDescription),
        badge: "error",
      };
    }

    if (!channel.isPublished) {
      return {
        type: "hidden",
        label: intl.formatMessage(messages.statusHidden),
        description: intl.formatMessage(messages.statusHiddenDescription),
      };
    }

    if (isFutureDate(channel.publishedAt)) {
      return {
        type: "scheduled",
        label: intl.formatMessage(messages.statusScheduled),
        description: intl.formatMessage(messages.statusScheduledDescription, {
          date: localizeDate(channel.publishedAt!, "lll"),
        }),
      };
    }

    return {
      type: "success",
      label: intl.formatMessage(messages.statusVisible),
      description: intl.formatMessage(messages.statusVisibleDescription),
    };
  };

  return (
    <ChannelAvailabilityCard
      entityType="collection"
      channels={channelSummaries}
      totalChannelsCount={totalChannelsCount}
      emptyDescription={intl.formatMessage(messages.emptyDescription)}
      onManageClick={onManageClick}
      managePermissions={managePermissions}
      getChannelStatus={getChannelStatus}
      renderChannelDetails={channelSummary => {
        const channel = sortedChannels.find(item => item.id === channelSummary.id);

        if (!channel) {
          return null;
        }

        const listingErrors = errors?.filter(error => error.channels?.includes(channel.id)) ?? [];
        const savedChannelListing = savedChannelListings.find(item => item.id === channel.id);

        return (
          <CollectionChannelVisibilitySection
            key={`${channel.id}-${savedChannelListing?.isPublished}-${savedChannelListing?.publishedAt ?? ""}`}
            channelId={channel.id}
            isPublished={channel.isPublished}
            publishedAt={channel.publishedAt}
            savedChannelListing={savedChannelListing}
            disabled={disabled}
            errors={listingErrors}
            onChange={(isPublished, publishedAt) =>
              onChannelChange(channel.id, { isPublished, publishedAt })
            }
          />
        );
      }}
    />
  );
};

CollectionChannelAvailabilityCard.displayName = "CollectionChannelAvailabilityCard";
