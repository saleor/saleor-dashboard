import { PluginErrorFragment } from "@saleor/fragments/types/PluginErrorFragment";
import { PluginErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  misconfigured: {
    defaultMessage: "Plugin is misconfigured and cannot be activated"
  },
  unique: {
    defaultMessage: "This field needs to be unique"
  }
});

function getPluginErrorMessage(
  err: PluginErrorFragment,
  intl: IntlShape
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
