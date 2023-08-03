import { defineMessages } from "react-intl";

export const columnsMessages = defineMessages({
  slug: {
    id: "oJkeS6",
    defaultMessage: "Attribute Code",
  },
  name: {
    id: "HjUoHK",
    defaultMessage: "Default Label",
    description: "attribute's label'",
  },
  visible: {
    id: "k6WDZl",
    defaultMessage: "Visible",
    description: "attribute is visible",
  },
  searchable: {
    id: "yKuba7",
    defaultMessage: "Searchable",
    description: "attribute can be searched in dashboard",
  },
  useInFacetedSearch: {
    defaultMessage: "Use as filter",
    id: "Y3pCRX",
    description: "attribute can be searched in storefront",
  },
});

export const messages = defineMessages({
  empty: {
    id: "ztQgD8",
    defaultMessage: "No attributes found",
  },
});
