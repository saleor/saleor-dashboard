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
    defaultMessage:
      "{channelCount} {channelCount,plural, =1 {Channel} other {Channels}}",
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
    description:
      "Status label when object is scheduled to publish in a channel",
  },
  published: {
    id: "sdA14A",
    defaultMessage: "Published",
    description: "Status label when object is published in a channel",
  },
});
