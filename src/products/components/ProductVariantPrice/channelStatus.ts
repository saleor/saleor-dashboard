import { type ChannelData } from "@dashboard/channels/utils";
import { type ChannelAvailabilityStatus } from "@dashboard/components/ChannelAvailability/types";
import { defineMessages, type IntlShape } from "react-intl";

const messages = defineMessages({
  activeLabel: {
    id: "UPqrEf",
    defaultMessage: "Active channel",
    description: "variant pricing channel status when channel is active",
  },
  activeDescription: {
    id: "HEjlAr",
    defaultMessage: "This channel is active and the product is published.",
    description: "variant pricing channel status description when channel is active",
  },
  inactiveLabel: {
    id: "1LaUBN",
    defaultMessage: "Inactive channel",
    description: "variant pricing channel status when channel is inactive",
  },
  inactiveDescription: {
    id: "0mHhwz",
    defaultMessage:
      "This channel is inactive. Customers cannot purchase from it until it is reactivated.",
    description: "variant pricing channel status description when channel is inactive",
  },
  unpublishedLabel: {
    id: "Q2wt4b",
    defaultMessage: "Unpublished",
    description: "variant pricing channel status when product is not published on channel",
  },
  unpublishedDescription: {
    id: "mQb4Pd",
    defaultMessage: "The product is not published on this channel yet.",
    description: "variant pricing channel status description when product is unpublished",
  },
});

export const getVariantPricingChannelStatus = (
  listing: Pick<ChannelData, "isActive" | "isPublished">,
  intl: IntlShape,
): ChannelAvailabilityStatus => {
  if (listing.isActive === false) {
    return {
      type: "hidden",
      label: intl.formatMessage(messages.inactiveLabel),
      description: intl.formatMessage(messages.inactiveDescription),
    };
  }

  if (listing.isPublished === false) {
    return {
      type: "warning",
      label: intl.formatMessage(messages.unpublishedLabel),
      description: intl.formatMessage(messages.unpublishedDescription),
    };
  }

  return {
    type: "success",
    label: intl.formatMessage(messages.activeLabel),
    description: intl.formatMessage(messages.activeDescription),
  };
};
