import { defineMessages } from "react-intl";

export const messages = defineMessages({
  appInstalled: {
    defaultMessage: "App installed",
    description: "message title"
  },
  appRemoved: {
    defaultMessage: "App successfully removed",
    description: "app has been removed"
  },
  appReadyToUse: {
    defaultMessage: "{name} is ready to be used",
    description: "app has been installed"
  },
  appCouldntInstall: {
    defaultMessage: "Couldn’t Install {name}",
    description: "message title"
  }
});
