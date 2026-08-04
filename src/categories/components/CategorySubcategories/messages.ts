import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "BdS6CQ",
    defaultMessage: "Subcategories",
    description: "category detail sidebar card title",
  },
  intro: {
    id: "BC/h4y",
    defaultMessage: "Open a child to edit it, or create a new subcategory under this one.",
    description: "category detail sidebar children card intro",
  },
  assignedCount: {
    id: "Bfh6NP",
    defaultMessage: "{count, plural, one {# subcategory} other {# subcategories}}",
    description: "sidebar header meta for number of child categories",
  },
  collapseAllSubcategories: {
    id: "v0fBOU",
    defaultMessage: "Collapse all",
  },
  create: {
    id: "UycVMp",
    defaultMessage: "Create subcategory",
    description: "button",
  },
  deleteSelected: {
    id: "U4By91",
    defaultMessage: "Delete categories",
    description: "bulk delete selected subcategories, button tooltip",
  },
  empty: {
    id: "4piZ1P",
    defaultMessage: "No categories found",
    description: "empty state when this category has no subcategories",
  },
});
