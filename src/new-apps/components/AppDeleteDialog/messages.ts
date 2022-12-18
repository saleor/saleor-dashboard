import { defineMessages } from "react-intl";

export default defineMessages({
  deleteAppTitle: {
    id: "zQX6xO",
    defaultMessage: "Delete App",
    description: "dialog header",
  },
  deleteApp: {
    id: "6hLZNA",
    defaultMessage: "Are you sure you want to delete this app?",
    description: "delete app",
  },
  deleteNamedApp: {
    id: "EWD/wU",
    defaultMessage:
      "Deleting {name}, you will remove installation of the app. If you are paying for app subscription, remember to unsubscribe from the app in Saleor Marketplace. Are you sure you want to delete the app?",
    description: "delete app",
  },
  deleteLocalNamedApp: {
    id: "LtqrM8",
    defaultMessage:
      "Deleting {name}, you will delete all the data and webhooks regarding this app. Are you sure you want to do that?",
    description: "delete custom app",
  },
});
