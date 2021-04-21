import { defineMessages } from "react-intl";

export const variantDetailsChannelsAvailabilityCardMessages = defineMessages({
  title: {
    defaultMessage: "Availability",
    description: "VariantDetailsChannelsAvailabilityCard title"
  },
  subtitle: {
    defaultMessage:
      "Available in {publishedInChannelsCount} out of {availableChannelsCount}",
    description: "VariantDetailsChannelsAvailabilityCard subtitle"
  },
  itemSubtitlePublished: {
    defaultMessage: "Published since {publicationDate}",
    description:
      "VariantDetailsChannelsAvailabilityCard item subtitle published"
  },
  itemSubtitleHidden: {
    defaultMessage: "Hidden",
    description: "VariantDetailsChannelsAvailabilityCard item subtitle hidden"
  },
  noItemsAvailable: {
    defaultMessage: "This variant is not available at any of the channels",
    description: "VariantDetailsChannelsAvailabilityCard no items available"
  }
});
