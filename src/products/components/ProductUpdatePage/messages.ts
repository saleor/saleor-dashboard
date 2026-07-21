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
  pendingVariantDeletes: {
    id: "w0m9Jc",
    defaultMessage:
      "{count, plural, one {# variant pending delete} other {# variants pending delete}}",
    description: "savebar hint when variants are marked for deletion but not saved yet",
  },
});
