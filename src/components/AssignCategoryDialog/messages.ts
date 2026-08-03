import { defineMessages } from "react-intl";

export const messages = defineMessages({
  assignCategoryDialogLabel: {
    id: "8hrH/z",
    defaultMessage: "Search Category",
    description: "dialog header",
  },
  assignCategoryDialogPlaceholder: {
    id: "sf6FMK",
    defaultMessage: "Search by category name, etc...",
    description: "dialog search placeholder",
  },
  assignCategoryDialogHeader: {
    id: "sW9IyX",
    defaultMessage: "Assign Category",
    description: "dialog header",
  },
  confirmButton: {
    id: "XLYssG",
    defaultMessage: "Assign and save",
    description: "assign categories to sale and save",
  },
  noCategoriesFound: {
    id: "UHhqmr",
    defaultMessage: "No categories found",
    description: "search results",
  },
  allLoadedCategoriesFilteredOut: {
    id: "py06r7",
    defaultMessage:
      "Every category loaded so far is already assigned. Search by name, or keep loading the list.",
    description: "assign category picker, client-side filter emptied the loaded pages",
  },
});
