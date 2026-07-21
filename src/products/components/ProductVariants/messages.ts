import { defineMessages } from "react-intl";

const messages = defineMessages({
  unsavedChangesTitle: {
    defaultMessage: "Unsaved changes",
    id: "bsxEP7",
    description: "dialog title when navigating away from dirty variants grid",
  },
  unsavedChangesDescription: {
    defaultMessage:
      "Save or discard your unsaved variant changes before continuing. Newly added rows must be saved before you can search or change page.",
    id: "8cQf6w",
    description: "dialog description when navigating away from dirty variants grid",
  },
  name: {
    defaultMessage: "Variant name",
    id: "J4E+jp",
  },
  sku: {
    defaultMessage: "SKU",
    id: "k4brJy",
  },
  channel: {
    defaultMessage: "Channels",
    id: "Vze3qI",
    description: "column category descriptor",
  },
  margin: {
    defaultMessage: "Margin",
    id: "Us9cA1",
    description: "profit margin",
  },
  price: {
    defaultMessage: "Price",
    id: "4hl9rS",
    description: "variant price in channel",
  },
  available: {
    defaultMessage: "Available",
    id: "BbP+k3",
    description: "variant availability in channel",
  },
  deleteSelected: {
    id: "HO4jvE",
    defaultMessage: "Delete ({count})",
    description: "bulk delete selected variants, including count for cross-page selection",
  },
  rangeWithPendingDeletes: {
    id: "YG29Na",
    defaultMessage: "{range} ({count} pending delete)",
    description: "variants grid range label with count of unsaved staged deletions",
  },
  empty: {
    defaultMessage: "Use button above to add new product variants",
    id: "IH47ID",
  },
  emptySearch: {
    defaultMessage: 'No variants match "{query}"',
    id: "ZJib9I",
    description: "empty state when variants grid search returns no results",
  },
  warehouses: {
    defaultMessage: "Warehouses",
    id: "U5Da30",
  },
  attributes: {
    defaultMessage: "Attributes",
    id: "+xTpT1",
  },
  title: {
    defaultMessage: "Variants",
    id: "1WbTJ5",
    description: "product variants, title",
  },
  fullScreenTitle: {
    defaultMessage: "Variants for: {name}",
    id: "64aQXZ",
    description: "product variants, full-screen title",
  },
});

export default messages;
