import { defineMessages } from "react-intl";

export const messages = defineMessages({
  status: {
    id: "s2y5eG",
    defaultMessage: "Status",
    description: "Status label",
  },
  channel: {
    id: "cFVgOo",
    defaultMessage: "Channel",
    description: "Channel label",
  },
  dropdownLabel: {
    id: "T0Mfxq",
    defaultMessage: "{channelCount} {channelCount,plural, =1 {Channel} other {Channels}}",
    description: "product status title",
  },
  noChannels: {
    id: "JgXBAw",
    defaultMessage: "No channels",
    description: "dropdown label when there are no channels assigned",
  },
});

export const channelStatusMessages = defineMessages({
  unpublished: {
    id: "rHoRbE",
    defaultMessage: "Unpublished",
    description: "Status label when object is unpublished in a channel",
  },
  scheduled: {
    id: "GzbSQk",
    defaultMessage: "Scheduled to publish",
    description: "Status label when object is scheduled to publish in a channel",
  },
  published: {
    id: "sdA14A",
    defaultMessage: "Published",
    description: "Status label when object is published in a channel",
  },
});

export const productAvailabilityMessages = defineMessages({
  statusLive: {
    id: "X2Ebzl",
    defaultMessage: "Live",
    description: "Product availability status when visible in a channel",
  },
  statusHidden: {
    id: "9KzuFr",
    defaultMessage: "Hidden",
    description: "Product availability status when not visible in a channel",
  },
  statusScheduled: {
    id: "KLEQGN",
    defaultMessage: "Scheduled",
    description: "Product availability status when publication is scheduled",
  },
  statusDescriptionLive: {
    id: "F9hInY",
    defaultMessage: "Product visible and purchasable",
    description: "Product availability in a channel when live and purchasable",
  },
  statusDescriptionLiveNotPurchasable: {
    id: "Hbjzr4",
    defaultMessage: "Product visible but not purchasable",
    description: "Product availability in a channel when visible but not purchasable",
  },
  statusDescriptionScheduled: {
    id: "uYEKNN",
    defaultMessage: "Product publication scheduled",
    description: "Product availability in a channel when publication is scheduled",
  },
  statusDescriptionHidden: {
    id: "Tat+A7",
    defaultMessage: "Product not visible to customers",
    description: "Product availability in a channel when hidden",
  },
  statusDescriptionPublished: {
    id: "mkU93f",
    defaultMessage: "Product published",
    description: "Product publication status when live in a channel",
  },
  statusDescriptionNotPurchasable: {
    id: "BOYxG5",
    defaultMessage: "Not purchasable",
    description: "Product purchasability status in a channel",
  },
  statusDescriptionChannelInactiveBlocked: {
    id: "nGuFx9",
    defaultMessage: "Channel inactive — cannot be purchased",
    description: "Channel status blocking purchase in a channel",
  },
  summaryAllLive: {
    id: "CXrIww",
    defaultMessage: "Live in {count} channels",
    description: "Product availability summary when live in every assigned channel",
  },
  summaryAllHidden: {
    id: "UHEtNL",
    defaultMessage: "Hidden in {count} channels",
    description: "Product availability summary when hidden in every assigned channel",
  },
  summaryAllScheduled: {
    id: "BmcBt9",
    defaultMessage: "Scheduled in {count} channels",
    description: "Product availability summary when scheduled in every assigned channel",
  },
  summaryLiveInSome: {
    id: "HKNVcY",
    defaultMessage: "Live in {liveCount} of {count} channels",
    description: "Product availability summary when live in some but not all channels",
  },
  summaryScheduledInSome: {
    id: "oYXeRV",
    defaultMessage: "Scheduled in {scheduledCount} of {count} channels",
    description: "Product availability summary when scheduled in some but not all channels",
  },
  summaryNotAvailable: {
    id: "GrBsBx",
    defaultMessage: "Not available",
    description: "Product availability summary when hidden in every assigned channel",
  },
});
