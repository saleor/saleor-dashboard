import { defineMessages } from "react-intl";

export const navigationPinMessages = defineMessages({
  pin: {
    id: "z/T5ab",
    defaultMessage: "Pin",
    description: "button, adds a model type to the sidebar",
  },
  unpin: {
    id: "VRHMrY",
    defaultMessage: "Unpin",
    description: "button, removes a model type from the sidebar",
  },
  pinnedByOrganization: {
    id: "nHbJnd",
    defaultMessage: "Pinned by organization",
    description: "label shown instead of the pin button",
  },
  pinDialogTitle: {
    id: "ClI6NL",
    defaultMessage: "Pin to navigation",
    description: "dialog header",
  },
  pinDialogDescription: {
    id: "VP5VVx",
    defaultMessage: "Choose where {name} should appear in the sidebar.",
    description: "dialog description",
  },
  targetLabel: {
    id: "jJG+J7",
    defaultMessage: "Section",
    description: "pin target select label",
  },
  scopeLabel: {
    id: "IMH4UI",
    defaultMessage: "Visible to",
    description: "pin scope select label",
  },
  scopeUser: {
    id: "RkcPCD",
    defaultMessage: "Only me",
    description: "pin scope option",
  },
  scopeOrganization: {
    id: "wHaptH",
    defaultMessage: "Everyone in the organization",
    description: "pin scope option",
  },
  targetFull: {
    id: "eCczRa",
    defaultMessage: "This section already has the maximum of {max} pins.",
    description: "validation message",
  },
  organizationPinsTitle: {
    id: "/S1aL9",
    defaultMessage: "Manage organization pins",
    description: "dialog header",
  },
  organizationPinsEmpty: {
    id: "hklWYW",
    defaultMessage: "No organization pins yet.",
    description: "empty state",
  },
  userPinsTitle: {
    id: "meH8tQ",
    defaultMessage: "Navigation pins",
    description: "account settings card header",
  },
  userPinsDescription: {
    id: "eBSWv6",
    defaultMessage: "Model types you pinned to your sidebar.",
    description: "account settings card subtitle",
  },
  userPinsEmpty: {
    id: "C7PYI9",
    defaultMessage: "You have not pinned any model types yet.",
    description: "empty state",
  },
  pinnedSuccess: {
    id: "XXZxyz",
    defaultMessage: "Pinned to navigation",
    description: "notification",
  },
  unpinnedSuccess: {
    id: "UoEmX9",
    defaultMessage: "Removed from navigation",
    description: "notification",
  },
  remove: {
    id: "U0XXbU",
    defaultMessage: "Remove",
    description: "button, removes a pin",
  },
});
