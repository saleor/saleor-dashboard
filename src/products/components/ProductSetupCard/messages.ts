import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "C+Rvqd",
    defaultMessage: "Finish setting up this product",
    description: "product setup card title",
  },
  subtitle: {
    id: "ieM/3E",
    defaultMessage:
      "Customers can’t buy this product until the required steps are done. Finish them now or come back later.",
    description: "product setup card subtitle while incomplete",
  },
  allDone: {
    id: "4YtjBu",
    defaultMessage: "This product is ready to sell. Review the optional steps below anytime.",
    description: "product setup card subtitle when required steps are complete",
  },
  nextUp: {
    id: "Gm3fGD",
    defaultMessage: "Next up: {task}",
    description: "footer hint for the next required setup task",
  },
  nextUpDone: {
    id: "0qkp6C",
    defaultMessage: "Required steps are complete.",
    description: "footer when sell blockers are done",
  },
  tasksSectionTitle: {
    id: "Vau17K",
    defaultMessage: "Required to sell",
    description: "setup checklist required section title",
  },
  reviewSectionTitle: {
    id: "9Czafv",
    defaultMessage: "Worth reviewing",
    description: "setup checklist optional section title",
  },
  reviewSectionSubtitle: {
    id: "RZppmC",
    defaultMessage: "Optional product details",
    description: "setup checklist review section subtitle",
  },
  dismiss: {
    id: "KUGwq/",
    defaultMessage: "Dismiss",
    description: "dismiss product setup checklist",
  },
  dismissComplete: {
    id: "77xfhp",
    defaultMessage: "Done",
    description: "dismiss product setup checklist when complete",
  },

  channelTitle: {
    id: "5sVhf7",
    defaultMessage: "Sales channel ready",
    description: "setup task title",
  },
  channelDescriptionAssign: {
    id: "61AaRN",
    defaultMessage: "Choose where this product is sold, then finish that channel’s setup.",
    description: "setup task when product has no channel listings",
  },
  channelDescriptionSetup: {
    id: "ofOBtB",
    defaultMessage:
      "This channel still needs a stock location{shipping, select, true { and shipping} other {}} before checkout can work.",
    description: "setup task when listed channel is missing warehouses/shipping",
  },
  channelDone: {
    id: "+JMqZM",
    defaultMessage: "{count} {count, plural, one {sales channel} other {sales channels}} ready",
    description: "setup task complete",
  },
  channelDetails: {
    id: "Eli6K6",
    defaultMessage:
      "Saleor sells through channels (like markets). Each channel needs a stock location—and shipping if you deliver—before customers can check out.",
    description: "Expanded help for channel setup",
  },
  channelAssignAction: {
    id: "Qi/CD3",
    defaultMessage: "Manage channels",
    description: "setup task CTA when no channels",
  },
  channelSetupAction: {
    id: "KIv44a",
    defaultMessage: "Finish channel setup",
    description: "setup task CTA deep-link to channel checklist",
  },

  categoryTitle: {
    id: "YIQcXh",
    defaultMessage: "Choose a category",
    description: "setup task title",
  },
  categoryDescription: {
    id: "NOvpOq",
    defaultMessage: "Saleor needs a category before a product can go live.",
    description: "setup task description when category missing",
  },
  categoryDone: {
    id: "V/wO67",
    defaultMessage: "Category selected",
    description: "setup task complete",
  },
  categoryDetails: {
    id: "W4J3wr",
    defaultMessage:
      "Publishing is blocked without a category. Pick one so storefronts can show and sell this product.",
    description: "Expanded help for category setup",
  },
  categoryAction: {
    id: "q7FuiD",
    defaultMessage: "Choose category",
    description: "setup task CTA",
  },

  offerTitle: {
    id: "Jf+f8h",
    defaultMessage: "Set a price",
    description: "setup task title when product already has variants",
  },
  offerTitleVariants: {
    id: "nyxzte",
    defaultMessage: "Add a variant with a price",
    description: "setup task title when product has no variants",
  },
  offerDescription: {
    id: "G+yyG5",
    defaultMessage: "Add a selling price for at least one sales channel.",
    description: "setup task description when priced offer missing",
  },
  offerDescriptionVariants: {
    id: "MZjG5u",
    defaultMessage: "Create at least one variant and set its price in a sales channel.",
    description: "setup task description when no variants",
  },
  offerDone: {
    id: "8WOkND",
    defaultMessage: "Priced and ready to sell",
    description: "setup task complete",
  },
  offerDetails: {
    id: "4YSViV",
    defaultMessage:
      "Checkout needs a variant with a price in the channel. You can refine cost and multi-variant pricing later.",
    description: "Expanded help for pricing setup",
  },
  offerAction: {
    id: "SEpOoC",
    defaultMessage: "Set price",
    description: "setup task CTA",
  },
  offerActionVariants: {
    id: "HUDdHT",
    defaultMessage: "Add variant",
    description: "setup task CTA when no variants",
  },

  stockTitle: {
    id: "sI49ZO",
    defaultMessage: "Add inventory",
    description: "setup task title",
  },
  stockDescription: {
    id: "D+OuoX",
    defaultMessage:
      "Enter quantity at a stock location linked to this channel so checkout can allocate stock.",
    description: "setup task description when stock missing",
  },
  stockDone: {
    id: "jPF46z",
    defaultMessage: "Inventory available",
    description: "setup task complete",
  },
  stockDetails: {
    id: "fBYGRk",
    defaultMessage:
      "Tracked products need stock in a warehouse assigned to the sales channel. Turn off inventory tracking on the variant if you don’t manage stock.",
    description: "Expanded help for inventory setup",
  },
  stockAction: {
    id: "fxFjSN",
    defaultMessage: "Add inventory",
    description: "setup task CTA",
  },

  liveTitle: {
    id: "97JrRu",
    defaultMessage: "Make available to buy",
    description: "setup task title",
  },
  liveDescription: {
    id: "/KH2jO",
    defaultMessage:
      "Publishes the product, shows it in listings, and opens it for purchase in your sales channels.",
    description: "setup task description when not live",
  },
  liveDone: {
    id: "29UzGR",
    defaultMessage: "Available to buy",
    description: "setup task complete",
  },
  liveDetails: {
    id: "f2vH1L",
    defaultMessage:
      "Until this step is done, the product stays a draft your customers can’t purchase. You can still schedule publish dates later in Availability.",
    description: "Expanded help for go-live setup",
  },
  liveAction: {
    id: "wCJg5X",
    defaultMessage: "Make available",
    description: "setup task CTA",
  },

  mediaReviewTitle: {
    id: "AjQc3p",
    defaultMessage: "Media",
    description: "review row title",
  },
  mediaReviewDescription: {
    id: "eyZODl",
    defaultMessage: "Add photos so customers recognize the product.",
    description: "review row description",
  },
  mediaReviewStatus: {
    id: "lMKFSP",
    defaultMessage: "{count, plural, =0 {None} one {# image} other {# images}}",
    description: "review row status",
  },
  seoReviewTitle: {
    id: "n95/GF",
    defaultMessage: "SEO",
    description: "review row title",
  },
  seoReviewDescription: {
    id: "+yjRMp",
    defaultMessage: "Slug, title, and description for search engines.",
    description: "review row description",
  },
  seoReviewStatusComplete: {
    id: "OYDVIa",
    defaultMessage: "Complete",
    description: "review row status when SEO slug, title, and description are set",
  },
  seoReviewStatusPartial: {
    id: "LNbO+F",
    defaultMessage: "Partial",
    description: "review row status when some but not all SEO fields are set",
  },
  seoReviewStatusEmpty: {
    id: "EufUzo",
    defaultMessage: "Optional",
    description: "review row status when SEO fields are empty",
  },
  attributesReviewTitle: {
    id: "/FYtVx",
    defaultMessage: "Attributes",
    description: "review row title",
  },
  attributesReviewDescriptionEmpty: {
    id: "OPSxxI",
    defaultMessage:
      "Assigned on the product type. They don’t appear on this page until the type has some.",
    description: "review row when the product type has no attributes",
  },
  attributesReviewDescriptionAssigned: {
    id: "uWxoc+",
    defaultMessage: "Product and variant fields from the product type.",
    description: "review row when the product type has attributes",
  },
  attributesReviewStatusNone: {
    id: "835PS4",
    defaultMessage: "None",
    description: "review row status when the product type has no attributes",
  },
  attributesReviewStatusCount: {
    id: "oNT0tG",
    defaultMessage: "{count} on this type",
    description: "review row status with product + variant attribute count",
  },
});
