import { defineMessages } from "react-intl";

export const productVariantMediaSelectDialogMessages = defineMessages({
  title: {
    id: "iPk640",
    defaultMessage: "Media Selection",
    description: "dialog header",
  },
  subtitle: {
    id: "u30A+K",
    defaultMessage: "Choose product images to assign to this variant.",
    description: "variant media selection dialog subtitle",
  },
  selectedCount: {
    id: "jWTXmC",
    defaultMessage: "{count, plural, one {# selected} other {# selected}}",
    description: "selected media count badge in variant media selection dialog",
  },
  empty: {
    id: "5nQ6yG",
    defaultMessage: "No product media available. Upload images on the product page first.",
    description: "empty state in variant media selection dialog",
  },
});
