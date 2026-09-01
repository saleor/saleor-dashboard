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
  pinToNav: {
    defaultMessage: "Pin to nav",
    id: "HCQlAJ",
    description: "button, adds a model type to the sidebar",
  },
  unpinFromNav: {
    defaultMessage: "Unpin from nav",
    id: "8vjjrE",
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
    id: "ht7hns",
    defaultMessage: "Shortcuts to model types in your sidebar. Pin more from the models list.",
    description: "account settings card subtitle",
  },
  userPinsCount: {
    id: "oLOOwI",
    defaultMessage: "{count} pinned",
    description: "account settings card header count",
  },
  userPinsNone: {
    id: "G8vJ+G",
    defaultMessage: "None pinned",
    description: "account settings card header when the list is empty",
  },
  userPinsEmptyTitle: {
    id: "tFy7p7",
    defaultMessage: "No pinned model types",
    description: "account settings empty state title",
  },
  userPinsEmptyDescription: {
    id: "z2m5wn",
    defaultMessage: "Open a model type and choose Pin to nav to add a shortcut.",
    description: "account settings empty state description",
  },
  viewModels: {
    id: "6mdMYB",
    defaultMessage: "View models",
    description: "account settings empty state action, opens the models list",
  },
  missingTypeName: {
    id: "eQi59D",
    defaultMessage: "Unavailable model type",
    description: "list row name when the pinned type no longer exists",
  },
  missingTypeDescription: {
    id: "TrMEpI",
    defaultMessage: "No longer exists · {section}",
    description: "list row description when the pinned type no longer exists",
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
  unpinConfirmTitle: {
    id: "aUJaqW",
    defaultMessage: "Unpin from navigation",
    description: "dialog header",
  },
  unpinConfirmDescription: {
    id: "2lcUqL",
    defaultMessage: "{name} will be removed from your sidebar. You can pin it again at any time.",
    description: "dialog description",
  },
  remove: {
    id: "U0XXbU",
    defaultMessage: "Remove",
    description: "button, removes a pin",
  },
});
