import { defineMessages } from "react-intl";

export const productVariantPriceMessages = defineMessages({
  title: {
    id: "Xm9qOu",
    defaultMessage: "Pricing",
    description: "product pricing, section header",
  },
  subtitle: {
    id: "uvHAJz",
    defaultMessage: "Listed on {listedInChannelsCount} of {availableChannelsCount} channels",
    description:
      "Product variant pricing card subtitle. Counts channel listings, not customer-facing availability or stock.",
  },
  emptyWithManage: {
    id: "VlcKLw",
    defaultMessage: "Choose channels to set selling and cost prices.",
    description: "product variant pricing empty state when channels can be assigned",
  },
  emptyNoProductChannels: {
    id: "w87NH1",
    defaultMessage: "Add channels on the product page before listing this variant.",
    description: "product variant pricing empty state when the product has no channels",
  },
  emptySimpleProduct: {
    id: "A1KX3d",
    defaultMessage: "Add channels in the Channels section to set prices",
    description: "simple product create pricing empty state",
  },
  manageChannels: {
    id: "hF952H",
    defaultMessage: "Manage channels",
    description: "product variant pricing manage channels button",
  },
});
