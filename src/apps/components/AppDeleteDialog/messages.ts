import { defineMessages } from "react-intl";

export default defineMessages({
  deleteAppTitle: {
    id: "zQX6xO",
    defaultMessage: "Delete App",
    description: "dialog header",
  },
  deleteApp: {
    id: "2rJcFa",
    defaultMessage:
      "Deleting this app, you will remove installation of the app. If you are paying for app subscription, remember to unsubscribe from the app in Saleor Marketplace.",
    description: "delete app",
  },
  deleteLocalApp: {
    id: "0vsMRq",
    defaultMessage:
      "Deleting this app, you will delete all the data and webhooks regarding this app.",
    description: "delete custom app",
  },
  deleteNamedApp: {
    id: "kYtxJ1",
    defaultMessage:
      "Deleting {name}, you will remove installation of the app. If you are paying for app subscription, remember to unsubscribe from the app in Saleor Marketplace.",
    description: "delete app",
  },
  deleteLocalNamedApp: {
    id: "nioOBQ",
    defaultMessage:
      "Deleting {name}, you will delete all the data and webhooks regarding this app.",
    description: "delete custom app",
  },
  deleteAppQuestion: {
    id: "6hLZNA",
    defaultMessage: "Are you sure you want to delete this app?",
    description: "delete app",
  },
  deleteAppWarning: {
    id: "+Ps1jL",
    defaultMessage:
      "Be extra careful with taxes and payment apps, ensure your configuration selects other apps to be used",
  },
});
