import { defineMessages } from "react-intl";

export const messages = defineMessages({
  editProductMetadata: {
    id: "V4Pdx+",
    defaultMessage: "Edit product metadata",
    description: "product detail page, top-bar metadata button tooltip",
  },
  openProductTypeSettings: {
    id: "1m5f0E",
    defaultMessage: "Product type settings",
    description: "product detail page menu, opens product type configuration",
  },
  openGraphiQL: {
    id: "PDw0YN",
    defaultMessage: "Open this product in GraphiQL",
    description: "open new window button",
  },
  showSetupChecklist: {
    id: "BTI5fl",
    defaultMessage: "Show setup checklist",
    description:
      "product detail menu, reopens the Finish setting up this product card after dismiss",
  },
  deleteProduct: {
    id: "j6dFO1",
    defaultMessage: "Delete product",
    description: "product detail cogs menu, opens the delete-confirmation dialog",
  },
  pendingVariantDeletes: {
    id: "w0m9Jc",
    defaultMessage:
      "{count, plural, one {# variant pending delete} other {# variants pending delete}}",
    description: "savebar hint when variants are marked for deletion but not saved yet",
  },
  saveCompositionDetails: {
    id: "FaL3f6",
    defaultMessage: "details",
    description: "Save composition segment for product details/SEO/organization/attributes",
  },
  saveCompositionChannels: {
    id: "Fwt3tF",
    defaultMessage: "{count, plural, one {# channel edited} other {# channels edited}}",
    description:
      "Save composition segment for dirty channel availability (publish, AFP, listings, add/remove)",
  },
  saveCompositionVariantEdits: {
    id: "dIDTp2",
    defaultMessage: "{count, plural, one {# variant edited} other {# variants edited}}",
    description:
      "Save composition segment for distinct variants with staged grid edits (count is variants, not edit operations)",
  },
  saveCompositionVariantCreates: {
    id: "/xgmw8",
    defaultMessage: "{count, plural, one {# new variant} other {# new variants}}",
    description: "Save composition segment for staged variant grid creates",
  },
  saveCompositionVariantDeletes: {
    id: "91Pvy0",
    defaultMessage:
      "{count, plural, one {# variant pending delete} other {# variants pending delete}}",
    description: "Save composition segment for staged variant deletes",
  },
  leaveDialogDescription: {
    id: "sh4Ozn",
    defaultMessage:
      "Media and metadata changes are already saved. Unsaved product details, availability, and variant edits will be lost.",
    description: "Exit form dialog body on product update page",
  },
  saveStepsTitle: {
    id: "IH3Xn2",
    defaultMessage: "Some changes were not saved",
    description: "Banner title after partial product save failure",
  },
  saveStepsDescription: {
    id: "rBfhUQ",
    defaultMessage:
      "Saving runs in steps. Review what applied below, fix the problem, and save again.",
    description: "Banner description after partial product save failure",
  },
  saveStepsDismiss: {
    id: "ki5OGg",
    defaultMessage: "Dismiss",
    description: "Dismiss partial product save banner",
  },
  saveStepFiles: {
    id: "CVaEon",
    defaultMessage: "Attribute files",
    description: "Product save pipeline step label",
  },
  saveStepProduct: {
    id: "p73Q1f",
    defaultMessage: "Product details",
    description: "Product save pipeline step label",
  },
  saveStepChannels: {
    id: "i0dH9w",
    defaultMessage: "Channel availability",
    description: "Product save pipeline step label",
  },
  saveStepVariantDelete: {
    id: "oEE4gd",
    defaultMessage: "Variant deletes",
    description: "Product save pipeline step label",
  },
  saveStepVariantCreate: {
    id: "JxRh2Z",
    defaultMessage: "Variant creates",
    description: "Product save pipeline step label",
  },
  saveStepVariantUpdate: {
    id: "2hWKKd",
    defaultMessage: "Variant updates",
    description: "Product save pipeline step label",
  },
  saveStepStatusSuccess: {
    id: "g3xSRW",
    defaultMessage: "Saved",
    description: "Product save pipeline step succeeded",
  },
  saveStepStatusError: {
    id: "dKeMgI",
    defaultMessage: "Failed",
    description: "Product save pipeline step failed",
  },
  saveStepStatusSkipped: {
    id: "KJ15H3",
    defaultMessage: "Skipped",
    description: "Product save pipeline step skipped",
  },
});
