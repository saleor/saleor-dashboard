import { type ChannelListingProductWithoutPricingFragment } from "@dashboard/graphql";
import {
  getAvailabilityStatus,
  isPurchasable,
} from "@dashboard/products/components/ProductDoctor/utils/availabilityStatus";
import { type MessageDescriptor } from "react-intl";

import { type DotStatus } from "../StatusDot/StatusDot";
import { productAvailabilityMessages } from "./messages";

export type ProductChannelListing = Pick<
  ChannelListingProductWithoutPricingFragment,
  "isPublished" | "publishedAt" | "availableForPurchaseAt" | "channel"
>;

export type ProductAvailabilityStatus = "live" | "scheduled" | "hidden";

export interface ProductChannelAvailabilityDetail {
  description: MessageDescriptor;
  dotStatus: DotStatus;
}

export interface ProductChannelAvailabilityItem {
  channel: ProductChannelListing["channel"];
  status: ProductAvailabilityStatus;
  statusLabel: MessageDescriptor;
  statusDetails: ProductChannelAvailabilityDetail[];
  dotStatus: DotStatus;
  isChannelInactive: boolean;
}

export interface ProductAvailabilitySummary {
  label: MessageDescriptor;
  labelValues?: Record<string, number | string>;
  dotStatus: DotStatus;
  channels: ProductChannelAvailabilityItem[];
}

const isChannelInactive = (listing: ProductChannelListing): boolean =>
  listing.channel.isActive === false;

const statusToLabel = (status: ProductAvailabilityStatus): MessageDescriptor => {
  switch (status) {
    case "live":
      return productAvailabilityMessages.statusLive;
    case "scheduled":
      return productAvailabilityMessages.statusScheduled;
    case "hidden":
      return productAvailabilityMessages.statusHidden;
  }
};

const getChannelDotStatus = (
  listing: ProductChannelListing,
  status: ProductAvailabilityStatus,
  dateNow: number,
): DotStatus => {
  switch (status) {
    case "live":
      if (isChannelInactive(listing)) {
        return "warning";
      }

      return isPurchasable({ availableForPurchaseAt: listing.availableForPurchaseAt }, dateNow)
        ? "success"
        : "warning";
    case "scheduled":
      return "scheduled";
    case "hidden":
      return "warning";
  }
};

const isCustomerLive = (channel: ProductChannelAvailabilityItem): boolean =>
  channel.status === "live" && !channel.isChannelInactive;

const getSummaryDotStatus = (
  channels: ProductChannelAvailabilityItem[],
  customerLiveCount: number,
  count: number,
): DotStatus => {
  if (customerLiveCount === 0) {
    return "error";
  }

  if (customerLiveCount < count) {
    return "warning";
  }

  if (channels.some(channel => channel.dotStatus === "warning")) {
    return "warning";
  }

  return "success";
};

export const getProductChannelAvailabilityStatus = (
  listing: ProductChannelListing,
  dateNow = Date.now(),
): ProductAvailabilityStatus =>
  getAvailabilityStatus(
    {
      isPublished: listing.isPublished,
      publishedAt: listing.publishedAt,
    },
    dateNow,
  );

export const getProductChannelStatusDetails = (
  listing: ProductChannelListing,
  status: ProductAvailabilityStatus,
  dateNow = Date.now(),
): ProductChannelAvailabilityDetail[] => {
  const channelInactive = isChannelInactive(listing);

  if (status === "live" && channelInactive) {
    return [
      {
        description: productAvailabilityMessages.statusDescriptionPublished,
        dotStatus: "success",
      },
      {
        description: productAvailabilityMessages.statusDescriptionChannelInactiveBlocked,
        dotStatus: "warning",
      },
    ];
  }

  if (status === "live") {
    if (!isPurchasable({ availableForPurchaseAt: listing.availableForPurchaseAt }, dateNow)) {
      return [
        {
          description: productAvailabilityMessages.statusDescriptionPublished,
          dotStatus: "success",
        },
        {
          description: productAvailabilityMessages.statusDescriptionNotPurchasable,
          dotStatus: "warning",
        },
      ];
    }

    return [
      {
        description: productAvailabilityMessages.statusDescriptionLive,
        dotStatus: "success",
      },
    ];
  }

  if (status === "scheduled" && channelInactive) {
    return [
      {
        description: productAvailabilityMessages.statusDescriptionScheduled,
        dotStatus: "scheduled",
      },
      {
        description: productAvailabilityMessages.statusDescriptionChannelInactiveBlocked,
        dotStatus: "warning",
      },
    ];
  }

  const dotStatus = getChannelDotStatus(listing, status, dateNow);

  switch (status) {
    case "scheduled":
      return [
        {
          description: productAvailabilityMessages.statusDescriptionScheduled,
          dotStatus,
        },
      ];
    case "hidden":
      return [
        {
          description: productAvailabilityMessages.statusDescriptionHidden,
          dotStatus,
        },
      ];
  }
};

const mapListingToChannelItem = (
  listing: ProductChannelListing,
  dateNow: number,
): ProductChannelAvailabilityItem => {
  const status = getProductChannelAvailabilityStatus(listing, dateNow);
  const channelInactive = isChannelInactive(listing);

  return {
    channel: listing.channel,
    status,
    statusLabel: statusToLabel(status),
    statusDetails: getProductChannelStatusDetails(listing, status, dateNow),
    dotStatus: getChannelDotStatus(listing, status, dateNow),
    isChannelInactive: channelInactive,
  };
};

export const getProductAvailabilitySummary = (
  listings: ProductChannelListing[],
  dateNow = Date.now(),
): ProductAvailabilitySummary => {
  const channels = listings.map(listing => mapListingToChannelItem(listing, dateNow));
  const count = channels.length;
  const customerLiveCount = channels.filter(isCustomerLive).length;
  const scheduledCount = channels.filter(channel => channel.status === "scheduled").length;
  const hiddenCount = channels.filter(channel => channel.status === "hidden").length;

  if (count === 1) {
    const [channel] = channels;

    return {
      label: channel.statusLabel,
      dotStatus: channel.dotStatus,
      channels,
    };
  }

  if (hiddenCount === count) {
    return {
      label: productAvailabilityMessages.summaryNotAvailable,
      dotStatus: "error",
      channels,
    };
  }

  if (customerLiveCount === count) {
    return {
      label: productAvailabilityMessages.summaryAllLive,
      labelValues: { count },
      dotStatus: getSummaryDotStatus(channels, customerLiveCount, count),
      channels,
    };
  }

  if (scheduledCount === count) {
    return {
      label: productAvailabilityMessages.summaryAllScheduled,
      labelValues: { count },
      dotStatus: "scheduled",
      channels,
    };
  }

  if (customerLiveCount > 0) {
    return {
      label: productAvailabilityMessages.summaryLiveInSome,
      labelValues: { liveCount: customerLiveCount, count },
      dotStatus: "warning",
      channels,
    };
  }

  if (scheduledCount > 0) {
    return {
      label: productAvailabilityMessages.summaryScheduledInSome,
      labelValues: { scheduledCount, count },
      dotStatus: "scheduled",
      channels,
    };
  }

  return {
    label: productAvailabilityMessages.summaryNotAvailable,
    dotStatus: "error",
    channels,
  };
};
