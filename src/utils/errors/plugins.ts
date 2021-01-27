import { PluginErrorFragment } from "@saleor/fragments/types/PluginErrorFragment";
import { commonMessages } from "@saleor/intl";
import { PluginErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

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
      case PluginErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case PluginErrorCode.INVALID:
        return intl.formatMessage(commonErrorMessages.invalid);
      case PluginErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      case PluginErrorCode.UNIQUE:
        return intl.formatMessage(messages.unique);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getPluginErrorMessage;
