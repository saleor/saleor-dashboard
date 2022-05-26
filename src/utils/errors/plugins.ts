import { PluginErrorCode, PluginErrorFragment } from "@saleor/graphql";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  misconfigured: {
    id: "0AQH0Q",
    defaultMessage: "Plugin is misconfigured and cannot be activated",
  },
  unique: {
    id: "lqIzC8",
    defaultMessage: "This field needs to be unique",
  },
});

function getPluginErrorMessage(
  err: PluginErrorFragment,
  intl: IntlShape,
): string {
  if (err) {
    switch (err.code) {
      case PluginErrorCode.PLUGIN_MISCONFIGURED:
        return intl.formatMessage(messages.misconfigured);
      case PluginErrorCode.UNIQUE:
        return intl.formatMessage(messages.unique);
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}

export default getPluginErrorMessage;
