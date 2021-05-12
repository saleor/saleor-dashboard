import { defineMessages } from "react-intl";

export const baseMessages = defineMessages({
  title: {
    defaultMessage:
      "Delete product {selectedTypesCount,plural,one{type} other{types}}",
    description: "ProductTypeDeleteWarningDialog title"
  },
  viewAssignedItemsButtonLabel: {
    defaultMessage: "View products",
    description:
      "ProductTypeDeleteWarningDialog single assigned items button label"
  }
});

export const singleWithItemsMessages = defineMessages({
  description: {
    defaultMessage:
      "You are about to delete product type <b>{typeName}</b>. It is assigned to {assignedItemsCount} {assignedItemsCount,plural,one{product} other{products}}. Deleting this product type will also delete those products. Are you sure you want to do this?",
    description:
      "ProductTypeDeleteWarningDialog single assigned items description",
    id: "ProductTypeDeleteWarningDialog single assigned items description"
  },
  consentLabel: {
    defaultMessage:
      "Yes, I want to delete this product type and assigned products",
    description: "ProductTypeDeleteWarningDialog single consent label",
    id: "ProductTypeDeleteWarningDialog single consent label"
  }
});

export const multipleWithItemsMessages = defineMessages({
  description: {
    defaultMessage:
      "You are about to delete multiple product types. Some of them are assigned to products. Deleting those product types will also delete those products",
    description:
      "ProductTypeDeleteWarningDialog with items multiple description",
    id: "ProductTypeDeleteWarningDialog with items multiple description"
  },
  consentLabel: {
    defaultMessage:
      "Yes, I want to delete those products types and assigned products",
    description: "ProductTypeDeleteWarningDialog multiple consent label",
    id: "ProductTypeDeleteWarningDialog multiple consent label"
  }
});

export const singleWithoutItemsMessages = defineMessages({
  description: {
    defaultMessage:
      "Are you sure you want to delete <b>{typeName}</b>? If you remove it you won’t be able to assign it to created products.",
    description:
      "ProductTypeDeleteWarningDialog single no assigned items description",
    id: "ProductTypeDeleteWarningDialog single no assigned items description"
  }
});

export const multipleWithoutItemsMessages = defineMessages({
  description: {
    defaultMessage:
      "Are you sure you want to delete selected product types? If you remove them you won’t be able to assign them to created products.",
    description:
      "ProductTypeDeleteWarningDialog multiple assigned items description",
    id: "ProductTypeDeleteWarningDialog multiple assigned items description"
  }
});
