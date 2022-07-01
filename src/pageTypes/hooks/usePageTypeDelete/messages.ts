import { defineMessages } from "react-intl";

export const baseMessages = defineMessages({
  title: {
    id: "oHbgcK",
    defaultMessage:
      "Delete page {selectedTypesCount,plural,one{type} other{types}}",
    description: "PageTypeDeleteWarningDialog title",
  },
  viewAssignedItemsButtonLabel: {
    id: "I8mqqj",
    defaultMessage: "View pages",
    description:
      "PageTypeDeleteWarningDialog single assigned items button label",
  },
});

export const singleWithItemsMessages = defineMessages({
  description: {
    id: "tQxBXs",
    defaultMessage:
      "You are about to delete page type <b>{typeName}</b>. It is assigned to {assignedItemsCount} {assignedItemsCount,plural,one{page} other{pages}}. Deleting this page type will also delete those pages. Are you sure you want to do this?",
    description:
      "PageTypeDeleteWarningDialog single assigned items description",
  },
  consentLabel: {
    id: "RZ32u5",
    defaultMessage: "Yes, I want to delete this page type and assigned pages",
    description: "PageTypeDeleteWarningDialog single consent label",
  },
});

export const multipleWithItemsMessages = defineMessages({
  description: {
    id: "TnyLrZ",
    defaultMessage:
      "You are about to delete multiple page types. Some of them are assigned to pages. Deleting those page types will also delete those pages",
    description: "PageTypeDeleteWarningDialog with items multiple description",
  },
  consentLabel: {
    id: "qu8b3v",
    defaultMessage:
      "Yes, I want to delete those pages types and assigned pages",
    description: "PageTypeDeleteWarningDialog multiple consent label",
  },
});

export const singleWithoutItemsMessages = defineMessages({
  description: {
    id: "VvFJ/T",
    defaultMessage:
      "Are you sure you want to delete <b>{typeName}</b>? If you remove it you won’t be able to assign it to created pages.",
    description:
      "PageTypeDeleteWarningDialog single no assigned items description",
  },
});

export const multipleWithoutItemsMessages = defineMessages({
  description: {
    id: "ll2dE6",
    defaultMessage:
      "Are you sure you want to delete selected page types? If you remove them you won’t be able to assign them to created pages.",
    description:
      "PageTypeDeleteWarningDialog multiple assigned items description",
  },
});
