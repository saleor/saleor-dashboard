import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "c5tWY8",
    defaultMessage: "Generate Variants",
    description: "dialog title",
  },
  subtitle: {
    id: "Vwqh4L",
    defaultMessage: "Select attribute values to create all possible variant combinations",
    description: "dialog subtitle explaining what user should do",
  },
  newBadge: {
    id: "cHsr1m",
    defaultMessage: "New",
    description: "badge for new variant that will be created",
  },
  existsBadge: {
    id: "kWuOqa",
    defaultMessage: "Exists",
    description: "badge for variant that already exists",
  },
  gridView: {
    id: "+BkNuT",
    defaultMessage: "Grid view",
    description: "aria label for grid view button",
  },
  listView: {
    id: "suAexp",
    defaultMessage: "List view",
    description: "aria label for list view button",
  },
  selectAll: {
    id: "YhGcC5",
    defaultMessage: "All",
    description: "select all values button",
  },
  selectNone: {
    id: "28vvyx",
    defaultMessage: "None",
    description: "deselect all values button",
  },
  existingSkipped: {
    id: "SHm5Dv",
    defaultMessage: "{count} already exist and will be skipped",
    description: "count of existing variants",
  },
  selectPrompt: {
    id: "ukjCvM",
    defaultMessage: "Select values above to generate variants",
    description: "empty state prompt",
  },
  initialStock: {
    id: "Om1LKj",
    defaultMessage: "Initial stock (all warehouses)",
    description: "stock input label",
  },
  skuPrefix: {
    id: "FS6Drh",
    defaultMessage: "SKU prefix",
    description: "sku prefix input label",
  },
  skuPreview: {
    id: "cD0BQQ",
    defaultMessage: "→ {example}",
    description: "sku preview example showing resulting SKU",
  },
  skuNotSet: {
    id: "/yy0uS",
    defaultMessage: "SKU will not be set",
    description: "message when no SKU prefix is provided",
  },
  generate: {
    id: "T61cLQ",
    defaultMessage: "Generate {count} {count, plural, one {variant} other {variants}}",
    description: "generate button",
  },
  noAttributes: {
    id: "O90S9P",
    defaultMessage: "No variant attributes defined for this product type.",
    description: "empty state when no variant attributes",
  },
  confirmTitle: {
    id: "jww7Wl",
    defaultMessage: "Generate {count} variants?",
    description: "confirmation dialog title",
  },
  confirmDescription: {
    id: "Q+oKl+",
    defaultMessage:
      "You are about to create {count} variants. This may take a moment to process. This action cannot be automatically undone.",
    description: "confirmation dialog description",
  },
  limitReached: {
    id: "KvK69l",
    defaultMessage:
      "Maximum {limit} variants can be generated at once. Please reduce your selection.",
    description: "limit reached warning",
  },
  allAlreadyExist: {
    id: "1qukRr",
    defaultMessage: "All selected combinations already exist as variants",
    description: "message when all selected variant combinations already exist",
  },
  matrixRequiresTwoAttributes: {
    id: "owCz2y",
    defaultMessage: "Matrix view requires exactly 2 attributes with selected values",
    description: "message when matrix view cannot be shown",
  },
  selectValuesPlaceholder: {
    id: "QY31tL",
    defaultMessage: "Search and select values...",
    description: "placeholder for multiselect dropdown",
  },
  selectValuesHint: {
    id: "d1AzfC",
    defaultMessage: "{count} options available",
    description: "hint text showing number of available options in multiselect",
  },
});
