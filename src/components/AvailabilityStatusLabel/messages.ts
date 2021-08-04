import { defineMessages } from "react-intl";

export const messages = defineMessages({
  published: {
    defaultMessage: "Published on {date}",
    description: "{type} publication date"
  },
  unpublished: {
    defaultMessage: "Unpublished",
    description: "{type} publication date"
  },
  willBePublished: {
    defaultMessage: "Becomes published on {date}",
    description: "{type} publication date"
  }
});
