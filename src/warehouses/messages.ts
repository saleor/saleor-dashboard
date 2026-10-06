import { defineMessages } from "react-intl";

export const messages = defineMessages({
  editMetadata: {
    id: "qJLCOw",
    defaultMessage: "Edit warehouse metadata",
    description: "warehouse metadata button title",
  },
  openGraphiQL: {
    id: "hCjD2F",
    defaultMessage: "Open in GraphiQL",
    description: "warehouse menu item",
  },
  deleteWarehouse: {
    id: "JWuPuQ",
    defaultMessage: "Delete warehouse",
    description: "warehouse menu item",
  },
  general: {
    id: "rVILkC",
    defaultMessage: "General",
    description: "warehouse general card title",
  },
  name: {
    id: "c8OaGD",
    defaultMessage: "Name",
    description: "warehouse name field",
  },
  email: {
    id: "uaoeFF",
    defaultMessage: "Email",
    description: "warehouse email field",
  },
  address: {
    id: "EtX8oQ",
    defaultMessage: "Address",
    description: "warehouse address card title",
  },
  addressPickupNotice: {
    id: "du3VQz",
    defaultMessage:
      "Customers collect orders at this address. Changing it means shoppers who already chose this location have to choose it again.",
    description: "warehouse address notice when pickup is enabled",
  },
  pickupTitle: {
    id: "m2vyKw",
    defaultMessage: "Customer pickup",
    description: "warehouse pickup card title",
  },
  pickupToggleTitle: {
    id: "erGm4S",
    defaultMessage: "Offer pickup",
    description: "warehouse pickup toggle",
  },
  pickupToggleOnDescription: {
    id: "1S7Gqs",
    defaultMessage:
      "Customers can collect orders at this address. Tax for those orders uses this address.",
    description: "warehouse pickup toggle when on",
  },
  pickupToggleOffDescription: {
    id: "l+Hrnh",
    defaultMessage: "Customers can't collect orders here.",
    description: "warehouse pickup toggle when off",
  },
  pickupAdvanced: {
    id: "c/hq1S",
    defaultMessage: "Advanced",
    description: "warehouse pickup advanced section",
  },
  pickupChoiceTitle: {
    id: "TjRH6D",
    defaultMessage: "Where the items come from",
    description: "warehouse pickup radio group title",
  },
  pickupChoiceDescription: {
    id: "jJIb3C",
    defaultMessage: "Choose where the items have to be in stock.",
    description: "warehouse pickup radio group description",
  },
  pickupLocal: {
    id: "Ptbuws",
    defaultMessage: "From stock at this location",
    description: "warehouse pickup option",
  },
  pickupLocalDescription: {
    id: "bCocRg",
    defaultMessage:
      "Shown when every item is in stock here. You pack the order from this location.",
    description: "warehouse pickup option",
  },
  pickupAll: {
    id: "ig8i+W",
    defaultMessage: "From stock at any location",
    description: "warehouse pickup option",
  },
  pickupAllDescription: {
    id: "YtEJXJ",
    defaultMessage:
      "Shown when the items are in stock across your locations. You may need to move items here before the customer collects them.",
    description: "warehouse pickup option",
  },
  listPickup: {
    id: "AgdhYN",
    defaultMessage: "Pickup",
    description: "orders list tag: order is picked up by the customer at a warehouse",
  },
  deleteImpactNoStock: {
    id: "NzJP2L",
    defaultMessage: "There is no stock at this location.",
    description: "warehouse delete dialog when the location has no stock",
  },
  deleteImpactStockOne: {
    id: "PA5SMu",
    defaultMessage: "Deletes 1 stock record and its allocations.",
    description: "warehouse delete dialog for a single stock record",
  },
  deleteImpactStock: {
    id: "QFJSRe",
    defaultMessage: "Deletes {count} stock records and their allocations.",
    description: "warehouse delete dialog when the stock count is known",
  },
  deleteImpactStockUnknown: {
    id: "3CRDKN",
    defaultMessage: "Deletes its stock records and their allocations.",
    description: "warehouse delete dialog when the stock count is unknown",
  },
  deleteImpactNoChannels: {
    id: "nE3kf5",
    defaultMessage: "It is not in a channel.",
    description: "warehouse delete dialog when the location is in no channel",
  },
  deleteImpactChannelOne: {
    id: "3h8G9p",
    defaultMessage: "It is removed from 1 channel.",
    description: "warehouse delete dialog for a single channel",
  },
  deleteImpactChannels: {
    id: "DWxcFv",
    defaultMessage: "It is removed from {count} channels.",
    description: "warehouse delete dialog when the channel count is known",
  },
  deleteImpactChannelsUnknown: {
    id: "46BDBP",
    defaultMessage: "It is removed from every channel it is in.",
    description: "warehouse delete dialog when the channel count is unknown",
  },
  stockCount: {
    id: "gEE2kY",
    defaultMessage: "{count, plural, one {# stock record} other {# stock records}}",
    description: "warehouse header stock count",
  },
  zonesTitle: {
    id: "SdsAmY",
    defaultMessage: "Shipping zones",
    description: "warehouse shipping zones card title",
  },
  zonesDirectIntro: {
    id: "hlor0I",
    defaultMessage: "Doesn't affect which stock is available in your store.",
    description: "warehouse shipping zones intro in direct stock mode",
  },
  zonesLegacyIntro: {
    id: "Qjj96A",
    defaultMessage: "Stock here counts only for countries in these zones.",
    description: "warehouse shipping zones intro in legacy stock mode",
  },
  zonesMore: {
    id: "sqzerb",
    defaultMessage: "+{count} more",
    description: "warehouse shipping zones truncated list",
  },
  zonesNeedChannel: {
    id: "al7UcB",
    defaultMessage: "Add this location to a channel first. Stock here can't be sold until then.",
    description: "warehouse shipping zones when the location has no channel",
  },
  zonesNeedZone: {
    id: "aDfpGM",
    defaultMessage:
      "Customers in a country can only buy this stock once a shipping zone in {channels} covers it.",
    description: "warehouse shipping zones when a channel exists but no zone is linked",
  },
  zonesEmptyTitle: {
    id: "c5zCMP",
    defaultMessage: "No shipping zone",
    description: "warehouse shipping zones empty state title",
  },
  zonesRemove: {
    id: "tJX2cD",
    defaultMessage: "Remove shipping zone",
    description: "warehouse shipping zones row remove label",
  },
  zonesEmptyDescription: {
    id: "aLEM/w",
    defaultMessage: "Add a shipping zone that shares this location's channel.",
    description: "warehouse shipping zones empty state",
  },
  zonesAssigned: {
    id: "eS57y+",
    defaultMessage: "Shipping zones updated",
    description: "warehouse shipping zones assign success",
  },
  zonesAssignFailed: {
    id: "y1Cpsv",
    defaultMessage: "Could not update every shipping zone",
    description: "warehouse shipping zones assign partial or failed",
  },
  zonesPickupWithoutZone: {
    id: "0YT3cW",
    defaultMessage: "Pickup works without a shipping zone.",
    description: "warehouse shipping zones note when pickup is on",
  },
  zonesOutsideChannel: {
    id: "IjDgLu",
    defaultMessage: "Not in this location's channels",
    description: "shipping zone that shares no channel with the warehouse",
  },
  zonesUnknown: {
    id: "hDrMCW",
    defaultMessage: "Shipping zones are linked from each shipping zone.",
    description: "warehouse shipping zones when channel membership could not be loaded",
  },
  listPlaceColumn: {
    id: "rBEb3x",
    defaultMessage: "Address",
    description: "warehouse list column",
  },
  listPlace: {
    id: "HO81c6",
    defaultMessage: "{city}, {country}",
    description: "warehouse list place, city then country",
  },
  channelsTitle: {
    id: "X9B8LO",
    defaultMessage: "Channels",
    description: "warehouse channels card title",
  },
  channelsAssignedCount: {
    id: "8BRck6",
    defaultMessage: "{count, plural, one {# assigned} other {# assigned}}",
    description: "warehouse channels card header count",
  },
  channelsRequired: {
    id: "VhwTgX",
    defaultMessage: "Required to sell",
    description: "warehouse channels card header when none are assigned",
  },
  channelsIntro: {
    id: "O59gJ5",
    defaultMessage: "Stock here can be sold in these channels.",
    description: "warehouse channels card description",
  },
  channelsEmptyTitle: {
    id: "YRWT8G",
    defaultMessage: "Stock here can't be sold yet",
    description: "warehouse channels empty state title",
  },
  channelsEmptyDescription: {
    id: "Y6b+Rh",
    defaultMessage: "Add this location to a channel.",
    description: "warehouse channels empty state description",
  },
  channelsAdd: {
    id: "ZFqgI5",
    defaultMessage: "Add",
    description: "warehouse channels assign button",
  },
  channelsAllAssigned: {
    id: "6ZfDCV",
    defaultMessage: "All channels are assigned.",
    description: "warehouse channels footer when every channel already includes this location",
  },
  channelsAddTitle: {
    id: "YkKWif",
    defaultMessage: "Add to channels",
    description: "warehouse channels assign dialog title",
  },
  channelsSearch: {
    id: "kO4yqk",
    defaultMessage: "Search channels",
    description: "warehouse channels assign dialog search",
  },
  channelsSelectAll: {
    id: "8JpLUB",
    defaultMessage: "Select all",
    description: "warehouse channels assign dialog",
  },
  channelsNoneLeft: {
    id: "0brnFc",
    defaultMessage: "This location is already in every channel.",
    description: "warehouse channels assign dialog when nothing is left",
  },
  channelsAssigned: {
    id: "jfUa3u",
    defaultMessage: "{count, plural, one {Added to # channel} other {Added to # channels}}",
    description: "warehouse channels assign success",
  },
  channelsAssignFailed: {
    id: "zHPCgr",
    defaultMessage: "Couldn't add this location to the channel. Try again.",
    description: "warehouse channels assign failure",
  },
  channelsAssignPartial: {
    id: "PFCa6L",
    defaultMessage: "Added to {ok} channels. Couldn't add to {failed}.",
    description: "warehouse channels assign partial failure",
  },
  channelsRemoved: {
    id: "nIMZLw",
    defaultMessage: "Removed from {channel}",
    description: "warehouse channel remove success",
  },
  channelsRemoveFailed: {
    id: "jKTgB9",
    defaultMessage: "Couldn't remove this location from the channel. Try again.",
    description: "warehouse channel remove failure",
  },
  channelsRemove: {
    id: "n8kSWe",
    defaultMessage: "Remove from {channel}",
    description: "warehouse channel remove button",
  },
  channelsRemoveTitle: {
    id: "Aih5r8",
    defaultMessage: "Remove from {channel}?",
    description: "warehouse channel remove confirmation title",
  },
  channelsRemoveUnlink: {
    id: "squrTb",
    defaultMessage:
      "{zones} will also be unlinked from this location, because they share no other channel.",
    description: "warehouse channel remove confirmation when zones would unlink",
  },
  channelsRemoveUnlinkMore: {
    id: "Q9aYIy",
    defaultMessage: "Other shipping zones may be unlinked too.",
    description: "warehouse channel remove when the zone list is incomplete",
  },
  channelsError: {
    id: "Pb48AH",
    defaultMessage: "Couldn't load channels.",
    description: "warehouse channels card error",
  },
  channelsRetry: {
    id: "RGrH9+",
    defaultMessage: "Try again",
    description: "warehouse channels card retry",
  },
  channelsNotInChannel: {
    id: "YZMo66",
    defaultMessage: "Not in a channel",
    description: "warehouse header when the location is in no channel",
  },
  channelsInCount: {
    id: "18x2F7",
    defaultMessage: "{count, plural, one {In # channel} other {In # channels}}",
    description: "warehouse header channel count",
  },
  channelsBanner: {
    id: "FWx5g+",
    defaultMessage: "Stock here can't be sold until this location is added to a channel.",
    description: "warehouse setup task when the location is in no channel",
  },
  channelsBannerAction: {
    id: "XQrxmH",
    defaultMessage: "Add a channel",
    description: "warehouse setup task action",
  },
  setupTitle: {
    id: "n6yout",
    defaultMessage: "Finish setting up this location",
    description: "warehouse setup checklist title",
  },
  setupSubtitle: {
    id: "yfUPdu",
    defaultMessage: "Customers can't buy stock from here until this step is done.",
    description: "warehouse setup checklist subtitle",
  },
  setupChannelTitle: {
    id: "jb9Vzu",
    defaultMessage: "Add to a channel",
    description: "warehouse setup task title",
  },
  setupChannelPermission: {
    id: "XUIYhJ",
    defaultMessage: "Needs permission to manage channels",
    description: "warehouse setup task when the user cannot assign channels",
  },
  setupReviewTitle: {
    id: "9Czafv",
    defaultMessage: "Worth reviewing",
    description: "setup checklist optional section title",
  },
  setupReviewSubtitle: {
    id: "0FU+SF",
    defaultMessage: "Stock in a country still needs a shipping zone that shares a channel.",
    description: "warehouse setup review section in the older stock mode",
  },
  setupReviewZonesDescription: {
    id: "i9nHR2",
    defaultMessage: "Customers in a country can buy this stock once a shipping zone covers it.",
    description: "warehouse setup review row for shipping zones",
  },
  setupReviewZonesNone: {
    id: "UV97Yb",
    defaultMessage: "No shipping zone",
    description: "warehouse setup review status when no zone is linked",
  },
  setupReviewZonesOne: {
    id: "36Jt9G",
    defaultMessage: "1 zone",
    description: "warehouse setup review status for one shipping zone",
  },
  setupReviewZonesCount: {
    id: "nNwacI",
    defaultMessage: "{count} zones",
    description: "warehouse setup review status when zones are linked",
  },
  setupNextUpDone: {
    id: "0hCh0t",
    defaultMessage: "Required steps are complete.",
    description: "footer when warehouse and shipping are done",
  },
  setupDismiss: {
    id: "O6C+2E",
    defaultMessage: "Skip for now",
    description: "dismiss setup checklist while required steps remain",
  },
  setupDismissComplete: {
    id: "IrwpKJ",
    defaultMessage: "Dismiss",
    description: "dismiss setup checklist after required steps are done",
  },
  showSetupChecklist: {
    id: "ZM3Rt9",
    defaultMessage: "Show setup checklist",
    description: "warehouse detail menu, reopens the setup checklist after dismiss",
  },
  setupNextUp: {
    id: "Gm3fGD",
    defaultMessage: "Next up: {task}",
    description: "footer hint for the next required setup task",
  },
});
