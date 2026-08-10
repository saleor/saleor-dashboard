import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "e2Sgrr",
    defaultMessage: "Catalog",
    description: "channel catalog section title",
  },
  subtitle: {
    id: "0ZveaI",
    defaultMessage:
      "Products are not added to a channel automatically. Add each product to this channel, set variant prices in {currency}, then publish it when it should be visible. Your shop has {total, plural, one {# product} other {# products}}.",
    description: "channel catalog section subtitle",
  },
  publishedStat: {
    id: "BerdNE",
    defaultMessage: "Published",
    description: "channel catalog count of products with isPublished true in this channel",
  },
  unpublishedStat: {
    id: "kiEkK/",
    defaultMessage: "Unpublished",
    description: "channel catalog count of in-channel products with isPublished false",
  },
  notInChannelStat: {
    id: "iqftjN",
    defaultMessage: "Not in channel",
    description: "channel catalog not in channel stat label",
  },
  addProducts: {
    id: "dUI83L",
    defaultMessage: "Add products to channel",
    description: "channel catalog primary action",
  },
  addProductsDescription: {
    id: "ttDLY+",
    defaultMessage:
      "Select products from your catalog, set prices, and publish them to this channel.",
    description: "channel catalog add products action description",
  },
  warehouseNoteNoShop: {
    id: "tdhr3t",
    defaultMessage:
      "Create a warehouse before you can set stock when adding products. You can still publish products and set prices.",
    description: "channel catalog warehouse hint when shop has no warehouses",
  },
  warehouseNoteNoChannel: {
    id: "8sIIGa",
    defaultMessage:
      "Assign a warehouse to this channel so checkout can allocate inventory and you can set stock when adding products.",
    description: "channel catalog warehouse hint when channel has no warehouses",
  },
  reviewUnpublished: {
    id: "Wv/8tv",
    defaultMessage: "Review unpublished products",
    description: "channel catalog action to review unpublished in-channel products",
  },
  reviewUnpublishedDescription: {
    id: "iRui6c",
    defaultMessage: "Added to this channel but publish is still off.",
    description: "channel catalog unpublished action description",
  },
  viewPublished: {
    id: "mBHG3G",
    defaultMessage: "View published products",
    description: "channel catalog action to view published products",
  },
  viewPublishedDescription: {
    id: "6I1/iS",
    defaultMessage: "Added to this channel with publish turned on.",
    description: "channel catalog published action description",
  },
  notInChannelStatus: {
    id: "Kw2ApX",
    defaultMessage: "{count} not in channel",
    description: "channel catalog add products row status",
  },
  unpublishedStatus: {
    id: "zDAOAk",
    defaultMessage: "{count} unpublished",
    description: "channel catalog unpublished row status",
  },
  publishedStatus: {
    id: "Y/hhGf",
    defaultMessage: "{count} published",
    description: "channel catalog published row status",
  },
  recentlyPublishedThumbnails: {
    id: "l54GOt",
    defaultMessage: "Recently published products",
    description: "accessible label for recently published product thumbnail stack",
  },
  subtitleWithoutStats: {
    id: "GvcIhr",
    defaultMessage:
      "Products are not added to a channel automatically. Add each product to this channel, set variant prices in {currency}, then publish it when it should be visible.",
    description: "channel catalog subtitle when product counts are unavailable",
  },
  catalogStatsError: {
    id: "HK9hkL",
    defaultMessage: "Could not load catalog stats. Refresh the page to try again.",
    description: "channel catalog stats fetch error",
  },
});
