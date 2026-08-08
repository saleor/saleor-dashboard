import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "HwPG8K",
    defaultMessage: "Finish setting up this voucher",
    description: "voucher setup card title",
  },
  titleCreate: {
    id: "F/Tado",
    defaultMessage: "Set up this voucher",
    description: "voucher setup card title on create",
  },
  subtitle: {
    id: "QIB6Eo",
    defaultMessage:
      "Customers can’t redeem this voucher until the required steps are done. Finish them now or come back later.",
    description: "voucher setup card subtitle while incomplete",
  },
  subtitleCreate: {
    id: "uBf9aK",
    defaultMessage: "Complete the required steps below before Save becomes available.",
    description: "voucher setup card subtitle on create while incomplete",
  },
  allDone: {
    id: "+iGiat",
    defaultMessage: "This voucher is ready to redeem. Review the optional steps below anytime.",
    description: "voucher setup card subtitle when required steps are complete",
  },
  nextUp: {
    id: "Gm3fGD",
    defaultMessage: "Next up: {task}",
    description: "footer hint for the next required setup task",
  },
  nextUpDone: {
    id: "sqz22u",
    defaultMessage: "Required steps are complete.",
    description: "footer when redeem blockers are done",
  },
  tasksSectionTitle: {
    id: "3SF3CQ",
    defaultMessage: "Required to redeem",
    description: "setup checklist required section title",
  },
  reviewSectionTitle: {
    id: "9Czafv",
    defaultMessage: "Worth reviewing",
    description: "setup checklist optional section title",
  },
  reviewSectionSubtitle: {
    id: "I81b5g",
    defaultMessage: "Optional campaign controls",
    description: "setup checklist review section subtitle",
  },
  codesTitle: {
    id: "vY7jZc",
    defaultMessage: "Add a code",
    description: "setup task title",
  },
  codesDescription: {
    id: "ZclWIw",
    defaultMessage:
      "Create a shared code or generate unique codes customers can enter at checkout.",
    description: "setup task description when no codes",
  },
  codesDone: {
    id: "S210hh",
    defaultMessage: "{count} {count, plural, one {code} other {codes}} ready",
    description: "setup task complete",
  },
  codesDetails: {
    id: "5zv4lF",
    defaultMessage:
      "A voucher without codes can’t be redeemed. Add one memorable code for campaigns, or generate unique codes for one-time use.",
    description: "Expanded help for codes setup",
  },
  codesAction: {
    id: "+xZjfP",
    defaultMessage: "Add codes",
    description: "setup task CTA",
  },
  channelsTitle: {
    id: "mfz2Td",
    defaultMessage: "Assign channels",
    description: "setup task title",
  },
  channelsDescription: {
    id: "79Vlq2",
    defaultMessage: "Choose which sales channels this voucher is available in.",
    description: "setup task description when no channels",
  },
  channelsDone: {
    id: "V6SjsS",
    defaultMessage: "{count} {count, plural, one {channel} other {channels}} assigned",
    description: "setup task complete",
  },
  channelsDetails: {
    id: "zZaxb8",
    defaultMessage:
      "Vouchers only apply in assigned channels. Assign every market where shoppers should be able to use this code.",
    description: "Expanded help for channel setup",
  },
  channelsAction: {
    id: "/fwEbi",
    defaultMessage: "Manage channels",
    description: "setup task CTA",
  },
  discountTitle: {
    id: "5TKyvj",
    defaultMessage: "Set the discount value",
    description: "setup task title",
  },
  discountDescription: {
    id: "g8qmQt",
    defaultMessage: "Enter a percentage or fixed amount so checkout knows how much to take off.",
    description: "setup task description when value missing",
  },
  discountDone: {
    id: "+Lknrr",
    defaultMessage: "Discount value set",
    description: "setup task complete",
  },
  discountDetails: {
    id: "5IQoMa",
    defaultMessage:
      "Percentage discounts use one value across channels. Fixed amounts are set per channel currency.",
    description: "Expanded help for discount value setup",
  },
  discountAction: {
    id: "qvjq6v",
    defaultMessage: "Set value",
    description: "setup task CTA",
  },
  catalogueTitle: {
    id: "fmgZv9",
    defaultMessage: "Assign eligible products",
    description: "setup task title for specific-product vouchers",
  },
  catalogueDescription: {
    id: "zJj3p5",
    defaultMessage:
      "Choose categories, collections, products, or variants this voucher applies to.",
    description: "setup task description when catalogue empty",
  },
  catalogueDone: {
    id: "yv/8Fb",
    defaultMessage: "{count} eligible {count, plural, one {item} other {items}} assigned",
    description: "setup task complete",
  },
  catalogueDetails: {
    id: "1LMrlA",
    defaultMessage:
      "Specific-product vouchers only discount the catalogue you assign. Until something is assigned, the code won’t reduce any line items.",
    description: "Expanded help for catalogue setup",
  },
  catalogueAction: {
    id: "pcUWaj",
    defaultMessage: "Assign items",
    description: "setup task CTA",
  },
  countriesTitle: {
    id: "ftQBOK",
    defaultMessage: "Confirm shipping countries",
    description: "setup task title for free-shipping vouchers",
  },
  countriesDescription: {
    id: "VYhySD",
    defaultMessage:
      "No countries selected means free shipping worldwide. Limit the list if this offer should only apply in some markets.",
    description: "setup task description when shipping voucher has no countries",
  },
  countriesDone: {
    id: "pTSCWo",
    defaultMessage: "{count} {count, plural, one {country} other {countries}} selected",
    description: "setup task complete when countries are restricted",
  },
  countriesWorldwideDone: {
    defaultMessage: "Worldwide — no country limit",
    id: "vSdHfr",
    description: "setup task complete when shipping voucher has empty countries (worldwide)",
  },
  countriesDetails: {
    id: "94nQ+l",
    defaultMessage:
      "Saleor treats an empty country list as worldwide. Assign countries to restrict free shipping, or skip this step if worldwide is intentional.",
    description: "Expanded help for shipping countries setup",
  },
  countriesAction: {
    id: "uVscLr",
    defaultMessage: "Review countries",
    description: "setup task CTA",
  },
  limitsReviewTitle: {
    id: "xWhlz+",
    defaultMessage: "Usage limits",
    description: "setup review row title",
  },
  limitsReviewDescription: {
    id: "PwrYMn",
    defaultMessage: "Cap total redemptions or limit use to once per customer.",
    description: "setup review row description",
  },
  requirementsReviewTitle: {
    id: "jwwgtR",
    defaultMessage: "Minimum requirements",
    description: "setup review row title",
  },
  requirementsReviewDescription: {
    id: "Y3ITmU",
    defaultMessage: "Require a minimum order value or item quantity before the code applies.",
    description: "setup review row description",
  },
  dismiss: {
    id: "O6C+2E",
    defaultMessage: "Skip for now",
    description: "dismiss setup checklist while required steps remain",
  },
  dismissComplete: {
    id: "IrwpKJ",
    defaultMessage: "Dismiss",
    description: "dismiss setup checklist after required steps are done",
  },
});
