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
  skuPrefixPlaceholder: {
    id: "kdK1YM",
    defaultMessage: "e.g. SHIRT",
    description: "placeholder for SKU prefix input",
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
  previewTruncated: {
    id: "m7EwFg",
    defaultMessage:
      "Your selection would create {total} variants. You can generate up to {limit} at a time.",
    description: "warning when preview is truncated due to too many combinations",
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
  missingDefaultsTitle: {
    id: "PUVq0k",
    defaultMessage: "Create without SKU and stock?",
    description: "warning dialog title when SKU and stock are not set",
  },
  missingDefaultsDescription: {
    id: "JwICkk",
    defaultMessage:
      "You haven't set a SKU prefix or initial stock. The variants will be created without these values. You can add them later by editing individual variants.",
    description: "warning dialog description when SKU and stock are not set",
  },
  requiredAttributesTitle: {
    id: "JaZh3+",
    defaultMessage: "Required attributes",
    description: "title for required non-selection attributes section",
  },
  requiredAttributesDescription: {
    id: "2NdGVf",
    defaultMessage: "These values will be applied to all generated variants.",
    description: "description for required non-selection attributes section",
  },
  selectValue: {
    id: "CD1NDm",
    defaultMessage: "Select a value",
    description: "placeholder for required attribute dropdown",
  },
  missingRequiredAttributes: {
    id: "zKEVOg",
    defaultMessage: "Please fill in all required attributes before generating variants.",
    description: "error message when required attributes are not filled",
  },
  unsupportedRequiredAttributesTitle: {
    id: "OCQLYd",
    defaultMessage: "Cannot use generator",
    description: "title for unsupported required attributes error",
  },
  unsupportedRequiredAttributesDescription: {
    id: "Ml19/F",
    defaultMessage:
      "Required attributes ({attributes}) are not supported.{newline}{newline}To proceed:{newline}1. Make them optional in product type{newline}2. Generate variants{newline}3. Set values manually{newline}4. Restore required setting",
    description: "description for unsupported required attributes error",
  },
  tabSelection: {
    id: "nUp0Lp",
    defaultMessage: "Selection Attributes",
    description: "tab label for variant selection attributes",
  },
  tabRequired: {
    id: "/ly15q",
    defaultMessage: "Required Attributes",
    description: "tab label for required attributes",
  },
  disabledNoNewVariants: {
    id: "d12NWZ",
    defaultMessage: "All possible variant combinations already exist",
    description: "tooltip when generate button is disabled because no new variants can be created",
  },
  disabledNoSelections: {
    id: "5WhtoK",
    defaultMessage: "Select at least one value for each selection attribute",
    description: "tooltip when generate button is disabled because no selections made",
  },
  disabledRequiredNotFilled: {
    id: "oZFssJ",
    defaultMessage: "Fill in all required attributes in the Required Attributes tab",
    description:
      "tooltip when generate button is disabled because required attributes are not filled",
  },
  disabledOverLimit: {
    id: "lz7o8y",
    defaultMessage: "Cannot create more than {limit} variants at once",
    description: "tooltip when generate button is disabled because over variant limit",
  },
});
