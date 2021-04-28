import { defineMessages } from "react-intl";

export default defineMessages({
  deactivateApp: {
    defaultMessage:
      "Are you sure you want to disable this app? Your data will be kept until you reactivate the app. You will be still billed for the app.",
    description: "deactivate app"
  },
  deactivateNamedApp: {
    defaultMessage:
      "Are you sure you want to disable {name}? Your data will be kept until you reactivate the app. You will be still billed for the app.",
    description: "deactivate named app"
  },
  deactivateLocalApp: {
    defaultMessage:
      "Are you sure you want to disable this app? Your data will be kept until you reactivate the app.",
    description: "deactivate local app"
  },
  deactivateLocalNamedApp: {
    defaultMessage:
      "Are you sure you want to disable {name}? Your data will be kept until you reactivate the app.",
    description: "deactivate local named app"
  }
});
