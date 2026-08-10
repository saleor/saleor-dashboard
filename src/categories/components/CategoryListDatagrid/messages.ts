import { defineMessages } from "react-intl";

export const columnsMessages = defineMessages({
  name: {
    id: "6AMFki",
    defaultMessage: "Name",
    description: "product name",
  },
  categoryName: {
    id: "kgVqk1",
    defaultMessage: "Category name",
  },
  subcategories: {
    defaultMessage: "Subcategories",
    id: "F7DxHw",
  },
  sidebarSubcategories: {
    id: "lDPwGU",
    defaultMessage: "Subs",
    description: "short subcategory count column header in category sidebar",
  },
  sidebarProducts: {
    defaultMessage: "Prods",
    id: "a5eZlA",
    description: "short product count column header in category sidebar",
  },
  numberOfProducts: {
    defaultMessage: "Number of products",
    id: "cLcy6F",
  },
});

export const messages = defineMessages({
  noData: {
    defaultMessage: "No categories found",
    id: "dM86a2",
  },
  loadMoreSubcategories: {
    id: "i8FLQQ",
    defaultMessage: "Load {count, plural, one {# more subcategory} other {# more subcategories}}",
    description: "load more subcategories in category tree",
  },
});
