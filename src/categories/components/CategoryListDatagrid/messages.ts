import { defineMessages } from "react-intl";

export const columnsMessages = defineMessages({
  categoryName: {
    id: "kgVqk1",
    defaultMessage: "Category name",
  },
  subcategories: {
    defaultMessage: "Subcategories",
    id: "F7DxHw",
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
