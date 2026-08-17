import { defineMessages } from "react-intl";

export const messages = defineMessages({
  channelUpdated: {
    id: "T9dLJY",
    defaultMessage: "Channel updated",
    description: "success toast after saving channel details",
  },
  saveCompositionGeneral: {
    id: "C+uqjN",
    defaultMessage: "general",
    description: "Save composition segment for channel name, slug, currency, country",
  },
  saveCompositionOrders: {
    id: "6UwNdZ",
    defaultMessage: "orders",
    description: "Save composition segment for channel order settings",
  },
  saveCompositionPayments: {
    id: "3NioLe",
    defaultMessage: "payments",
    description: "Save composition segment for channel payment and checkout settings",
  },
  saveCompositionInventory: {
    id: "mOyjAi",
    defaultMessage: "inventory",
    description: "Save composition segment for warehouses and allocation strategy",
  },
  saveCompositionDelivery: {
    id: "Z79yxZ",
    defaultMessage: "delivery",
    description: "Save composition segment for shipping zones",
  },
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
  duplicateChannel: {
    id: "xi32al",
    defaultMessage: "Duplicate channel",
    description:
      "channel detail cogs menu, opens create dialog prefilled from this channel's settings",
  },
  showSetupChecklist: {
    id: "AqAfTD",
    defaultMessage: "Show setup checklist",
    description:
      "channel detail cogs menu, reopens the Finish setting up this channel card after dismiss",
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
