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
    id: "W75xMz",
    defaultMessage: "Visible in storefront",
    description: "attribute is visible in storefront",
  },
  searchable: {
    id: "bWvn/Y",
    defaultMessage: "Filterable in dashboard",
    description: "attribute can be searched in dashboard",
  },
  useInFacetedSearch: {
    defaultMessage: "Filterable in storefront",
    id: "9IrVVZ",
    description: "attribute can be searched in storefront",
  },
});

export const messages = defineMessages({
  empty: {
    id: "ztQgD8",
    defaultMessage: "No attributes found",
  },
});
