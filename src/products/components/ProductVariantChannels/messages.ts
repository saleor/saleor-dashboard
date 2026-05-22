import { defineMessages } from "react-intl";

export const variantDetailsChannelsAvailabilityCardMessages = defineMessages({
  title: {
    id: "sedoZ3",
    defaultMessage: "Availability",
    description: "VariantDetailsChannelsAvailabilityCard title",
  },
  subtitle: {
    id: "I+czjk",
    defaultMessage: "Listed in {publishedInChannelsCount} of {availableChannelsCount} channels",
    description:
      "VariantDetailsChannelsAvailabilityCard subtitle. Counts channel listings, not customer-facing availability or stock. Phrasing must not imply purchasability.",
  },
  itemSubtitlePublished: {
    id: "0ReyKr",
    defaultMessage: "Published since {publishedAt}",
    description: "VariantDetailsChannelsAvailabilityCard item subtitle published",
  },
  itemSubtitleHidden: {
    id: "EsZH44",
    defaultMessage: "Hidden",
    description: "VariantDetailsChannelsAvailabilityCard item subtitle hidden",
  },
  noItemsAvailable: {
    id: "jqJqdE",
    defaultMessage: "This variant is not available at any of the channels",
    description: "VariantDetailsChannelsAvailabilityCard no items available",
  },
  manageButtonText: {
    id: "2CBcub",
    defaultMessage: "Manage",
    description: "CreateVariantTitle manage",
  },
});
