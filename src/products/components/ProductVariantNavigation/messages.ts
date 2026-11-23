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
  noMatches: {
    id: "OW8fv1",
    defaultMessage: "No variants match your search",
    description: "shown in the variant list when a search finds nothing",
  },
  clearSearch: {
    id: "iPQ7zY",
    defaultMessage: "Clear search",
    description: "button that empties the variant search and shows the whole list again",
  },
  variantPosition: {
    id: "wXHLnB",
    defaultMessage: "{position} of {total}",
    description:
      "place of the open variant among the product's variants, shown next to previous and next buttons, e.g. 3 of 24",
  },
  variantsCount: {
    id: "AV90gj",
    defaultMessage: "{count, plural, one {# variant} other {# variants}}",
    description: "number of variants the product has, shown in the variant switcher",
  },
  previousVariant: {
    id: "qvIlFa",
    defaultMessage: "Previous variant",
    description: "button that opens the variant before the open one",
  },
  nextVariant: {
    id: "cy7gQI",
    defaultMessage: "Next variant",
    description: "button that opens the variant after the open one",
  },
  showVariantList: {
    id: "K0eCVE",
    defaultMessage: "Show all variants",
    description: "button that opens the list of the product's variants",
  },
  hideVariantList: {
    id: "HtEe9i",
    defaultMessage: "Hide variant list",
    description: "button that closes the list of the product's variants",
  },
  pinnedActiveHint: {
    id: "WGHw5Q",
    defaultMessage: "Not visible in the list — scroll or search.",
    description:
      "Hint under the pinned current variant when it is out of the scroll viewport or not loaded yet",
  },
});
