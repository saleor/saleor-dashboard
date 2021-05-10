import { defineMessages } from "react-intl";

export const baseMessages = defineMessages({
  singleTitle: {
    defaultMessage: "Delete page type",
    description: "ProductTypeDeleteWarningDialog single title"
  },
  multipleTitle: {
    defaultMessage: "Delete page types",
    description: "ProductTypeDeleteWarningDialog multiple title"
  },
  viewAssignedItemsButtonLabel: {
    defaultMessage: "View pages",
    description:
      "ProductTypeDeleteWarningDialog single assigned items button label"
  }
});

export const singleWithItemsMessages = defineMessages({
  description: {
    defaultMessage:
      "You are about to delete page type {typeName}. It is assigned to {assignedItemsCount} pages. Deleting this page type will also delete those pages. Are you sure you want to do this?",
    description:
      "ProductTypeDeleteWarningDialog single assigned items description"
  },
  consentLabel: {
    defaultMessage: "Yes, I want to delete this page type and assigned pages",
    description: "ProductTypeDeleteWarningDialog single consent label"
  }
});

export const multipleWithItemsMessages = defineMessages({
  description: {
    defaultMessage:
      "You are about to delete multiple page types. Some of them are assigned to pages. Deleting those page types will also delete those pages",
    description:
      "ProductTypeDeleteWarningDialog with items multiple description"
  },
  consentLabel: {
    defaultMessage:
      "Yes, I want to delete those pages types and assigned pages",
    description: "ProductTypeDeleteWarningDialog multiple consent label"
  }
});

export const singleWithoutItemsMessages = defineMessages({
  description: {
    defaultMessage:
      "Are you sure you want to delete {typeName}? If you remove it you won’t be able to assign it to created pages.",
    description:
      "ProductTypeDeleteWarningDialog single assigned items description"
  }
});

export const multipleWithoutItemsMessages = defineMessages({
  description: {
    defaultMessage:
      "Are you sure you want to delete selected page types? If you remove them you won’t be able to assign them to created pages.",
    description:
      "ProductTypeDeleteWarningDialog single assigned items description"
  }
});
