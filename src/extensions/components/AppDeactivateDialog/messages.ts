import { defineMessages } from "react-intl";

export default defineMessages({
  deactivateAppTitle: {
    id: "RmEeMP",
    defaultMessage: "Deactivate Extension",
    description: "dialog header",
  },
  deactivateApp: {
    id: "C6pJYY",
    defaultMessage:
      "Are you sure you want to disable this extension? Your data will be kept until you reactivate the extension.",
    description: "deactivate app",
  },
  deactivateNamedApp: {
    id: "aC7AjR",
    defaultMessage:
      "Are you sure you want to disable {name}? Your data will be kept until you reactivate the extension.",
    description: "deactivate named app",
  },
  deactivateAppBillingInfo: {
    id: "71Agnt",
    defaultMessage: "You will be still billed for the extension.",
    description: "deactivate app billing info",
  },
});
