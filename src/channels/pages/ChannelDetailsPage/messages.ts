import { defineMessages } from "react-intl";

export const messages = defineMessages({
  editChannelMetadata: {
    id: "N4rmXl",
    defaultMessage: "Edit channel metadata",
    description: "channel detail page, top-bar metadata button tooltip",
  },
  taxSettings: {
    id: "Jb8345",
    defaultMessage: "Tax settings",
    description: "channel detail cogs menu, opens tax configuration for this channel",
  },
  openGraphiQL: {
    id: "KXYvNG",
    defaultMessage: "Open in GraphiQL",
    description: "channel detail cogs menu, opens GraphiQL with this channel",
  },
  deleteChannel: {
    id: "IlPaqv",
    defaultMessage: "Delete channel",
    description: "channel detail cogs menu, opens the delete-confirmation dialog",
  },
  statusActive: {
    id: "HBrAXs",
    defaultMessage: "Active",
    description: "channel status",
  },
  statusInactive: {
    id: "rZh6/D",
    defaultMessage: "Inactive",
    description: "channel status",
  },
  headerCountryCurrency: {
    id: "GXxpRA",
    defaultMessage: "{country} · {currency}",
    description: "channel detail title secondary meta after status pill",
  },
});
