import { defineMessages } from "react-intl";

export default defineMessages({
  deleteAppTitle: {
    id: "QdanQw",
    defaultMessage: "Delete Extension",
    description: "dialog header",
  },
  deleteApp: {
    id: "IW4YT7",
    defaultMessage:
      "By deleting this extension, you will remove installation of the extension. If you are paying for extension's subscription, remember to unsubscribe from the extension in Saleor Marketplace.",
    description: "delete app",
  },
  deleteLocalApp: {
    id: "8/PQ07",
    defaultMessage:
      "By deleting this extension, you will delete all the data and webhooks regarding this extension.",
    description: "delete custom app",
  },
  deleteNamedApp: {
    id: "nIwoHa",
    defaultMessage:
      "By deleting {name}, you will remove installation of the extension. If you are paying for extension's subscription, remember to unsubscribe from the extension in Saleor Marketplace.",
    description: "delete app",
  },
  deleteLocalNamedApp: {
    id: "vYMZxh",
    defaultMessage:
      "By deleting {name}, you will delete all the data and webhooks regarding this extension.",
    description: "delete custom app",
  },
  deleteAppQuestion: {
    id: "S8ew6Q",
    defaultMessage: "Are you sure you want to delete this extension?",
    description: "delete app",
  },
  deleteAppWarning: {
    id: "1Znp5B",
    defaultMessage:
      "Be extra careful with taxes and payment extensions, ensure your configuration selects other extension to be used",
  },
});
