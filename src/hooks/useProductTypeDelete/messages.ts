import { defineMessages } from "react-intl";

export const baseMessages = defineMessages({
  singleTitle: {
    defaultMessage: "Delete product type",
    description: "ProductTypeDeleteWarningDialog single title"
  },
  multipleTitle: {
    defaultMessage: "Delete product types",
    description: "ProductTypeDeleteWarningDialog multiple title"
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
      "You are about to delete product type {typeName}. It is assigned to {assignedItemsCount} products. Deleting this product type will also delete those products. Are you sure you want to do this?",
    description:
      "ProductTypeDeleteWarningDialog single assigned items description"
  },
  consentLabel: {
    defaultMessage:
      "Yes, I want to delete this product type and assigned products",
    description: "ProductTypeDeleteWarningDialog single consent label"
  }
});

export const multipleWithItemsMessages = defineMessages({
  description: {
    defaultMessage:
      "You are about to delete multiple product types. Some of them are assigned to products. Deleting those product types will also delete those products",
    description:
      "ProductTypeDeleteWarningDialog with items multiple description"
  },
  consentLabel: {
    defaultMessage:
      "Yes, I want to delete those products types and assigned products",
    description: "ProductTypeDeleteWarningDialog multiple consent label"
  }
});

export const singleWithoutItemsMessages = defineMessages({
  description: {
    defaultMessage:
      "Are you sure you want to delete {typeName}? If you remove it you won’t be able to assign it to created products.",
    description:
      "ProductTypeDeleteWarningDialog single assigned items description"
  }
});

export const multipleWithoutItemsMessages = defineMessages({
  description: {
    defaultMessage:
      "Are you sure you want to delete selected product types? If you remove them you won’t be able to assign them to created products.",
    description:
      "ProductTypeDeleteWarningDialog single assigned items description"
  }
});
