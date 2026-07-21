import { defineMessages } from "react-intl";

export const messages = defineMessages({
  defaultVariant: {
    id: "vZMs8f",
    defaultMessage: "Default",
    description: "default product variant indicator",
  },
  addVariant: {
    id: "3C3Nj5",
    defaultMessage: "Add variant",
    description: "button",
  },
  newVariant: {
    id: "IqRBql",
    defaultMessage: "New variant",
    description: "variant name",
  },
  searchPlaceholder: {
    id: "pznlvs",
    defaultMessage: "Search variants",
    description: "variant sibling navigator search placeholder",
  },
  siblingsCount: {
    id: "jHoIFG",
    defaultMessage: "{loaded} of {total}",
    description: "how many sibling variants are loaded vs total",
  },
  loadingMore: {
    id: "JUK2So",
    defaultMessage: "Loading…",
    description: "loading state while fetching more sibling variants on scroll",
  },
  pinnedActiveHint: {
    id: "WGHw5Q",
    defaultMessage: "Not visible in the list — scroll or search.",
    description:
      "Hint under the pinned current variant when it is out of the scroll viewport or not loaded yet",
  },
});
