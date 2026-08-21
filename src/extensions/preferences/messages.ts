import { defineMessages } from "react-intl";

export const extensionPreferencesMessages = defineMessages({
  pin: {
    id: "qsKsBe",
    defaultMessage: "Pin extension",
    description: "tooltip for pin action on a widget extension",
  },
  unpin: {
    id: "B9OFxo",
    defaultMessage: "Unpin extension",
    description: "tooltip for unpin action",
  },
  hide: {
    id: "cGL5Xv",
    defaultMessage: "Hide extension",
    description: "tooltip for hide action on a widget extension",
  },
  sectionTitle: {
    id: "r2ajD2",
    defaultMessage: "Extensions visibility",
    description: "account settings section title",
  },
  sectionSubtitle: {
    id: "/2uCva",
    defaultMessage: "Pin extensions to the top or hide them across the dashboard.",
    description: "account settings section subtitle",
  },
  stateDefault: {
    id: "TCV876",
    defaultMessage: "Default",
    description: "tri-state option: default visibility",
  },
  statePinned: {
    id: "WCl+E+",
    defaultMessage: "Pinned",
    description: "tri-state option: pinned",
  },
  stateHidden: {
    id: "rNNHeS",
    defaultMessage: "Hidden",
    description: "tri-state option: hidden",
  },
  emptyState: {
    id: "qO6iZs",
    defaultMessage: "No extensions available to manage.",
    description: "empty state for extensions visibility list",
  },
});
