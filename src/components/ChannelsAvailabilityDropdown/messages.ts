import { defineMessages } from "react-intl";

export const messages = defineMessages({
  status: {
    defaultMessage: "Status",
    description: "Status label"
  },
  channel: {
    defaultMessage: "Channel",
    description: "Channel label"
  },
  dropdownLabel: {
    defaultMessage:
      "{channelCount} {channelCount,plural, =1 {Channel} other {Channels}}",
    description: "product status title"
  },
  noChannels: {
    defaultMessage: "No channels",
    description: "dropdown label when there are no channels assigned"
  }
});

export const channelStatusMessages = defineMessages({
  unpublished: {
    defaultMessage: "Unpublished",
    description: "Status label when object is unpublished in a channel"
  },
  scheduled: {
    defaultMessage: "Scheduled to publish",
    description: "Status label when object is scheduled to publish in a channel"
  },
  published: {
    defaultMessage: "Published",
    description: "Status label when object is published in a channel"
  }
});
