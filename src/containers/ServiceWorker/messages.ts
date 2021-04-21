import { defineMessages } from "react-intl";

const messages = defineMessages({
  newVersionTitle: {
    defaultMessage: "New version is available",
    description: "notification title"
  },
  newVersionContent: {
    defaultMessage:
      "To update the application to the latest version, please refresh the page",
    description: "new version notification content"
  },
  refresh: {
    defaultMessage: "Refresh",
    description: "button"
  }
});

export default messages;
