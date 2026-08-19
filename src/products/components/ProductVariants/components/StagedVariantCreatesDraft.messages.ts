import { defineMessages } from "react-intl";

export const stagedVariantCreatesDraftMessages = defineMessages({
  title: {
    id: "qtSRwh",
    defaultMessage:
      "{count, plural, one {# new variant (unsaved)} other {# new variants (unsaved)}}",
    description: "Title for the draft list of generator-staged variants awaiting Save",
  },
  clearAll: {
    id: "PmLFgv",
    defaultMessage: "Clear all",
    description: "Button to remove all staged generator creates",
  },
});
