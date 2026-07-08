import { defineMessages } from "react-intl";

export const attributeListPageMessages = defineMessages({
  groupByType: {
    id: "cPEhZO",
    defaultMessage: "Group by type",
    description: "view menu option to group attribute list by product or model type",
  },
  unassignAttributes: {
    id: "FgHWZ1",
    defaultMessage: "Unassign",
    description: "bulk unassign attributes from the active product or model type",
  },
  unassignFromProductTypeHint: {
    id: "INGC4/",
    defaultMessage:
      "Attributes are removed from this product type only. They are not deleted and remain available for other product types. Products that use other types are not affected.",
    description: "helper text in unassign dialog on product attributes list, type tab",
  },
  unassignFromModelTypeHint: {
    id: "XBPCxj",
    defaultMessage:
      "Attributes are removed from this model type only. They are not deleted and remain available for other model types. Models that use other types are not affected.",
    description: "helper text in unassign dialog on model attributes list, type tab",
  },
});
