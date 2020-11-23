import { AppErrorFragment } from "@saleor/fragments/types/AppErrorFragment";
import { commonMessages } from "@saleor/intl";
import { AppErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
  invalidManifestFormat: {
    defaultMessage: "Invalid manifest format"
  },
  invalidPermission: {
    defaultMessage: "Permission is invalid"
  },
  invalidStatus: {
    defaultMessage: "Status is invalid"
  },
  invalidUrlFormat: {
    defaultMessage: "Url has invalid format"
  },
  outOfScopeApp: {
    defaultMessage: "App is out of your permissions scope"
  },
  outOfScopeGroup: {
    defaultMessage: "Group is out of your permission scope"
  },
  outOfScopePermission: {
    defaultMessage: "Permission is out of your scope"
  },
  unique: {
    defaultMessage: "This needs to be unique"
  }
});

function getAppErrorMessage(err: AppErrorFragment, intl: IntlShape): string {
  if (err) {
    switch (err.code) {
      case AppErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case AppErrorCode.INVALID:
        return intl.formatMessage(commonErrorMessages.invalid);
      case AppErrorCode.INVALID_MANIFEST_FORMAT:
        return intl.formatMessage(messages.invalidManifestFormat);
      case AppErrorCode.OUT_OF_SCOPE_APP:
        return intl.formatMessage(messages.outOfScopeApp);
      case AppErrorCode.OUT_OF_SCOPE_PERMISSION:
        return intl.formatMessage(messages.outOfScopePermission);
      case AppErrorCode.INVALID_PERMISSION:
        return intl.formatMessage(messages.invalidPermission);
      case AppErrorCode.INVALID_STATUS:
        return intl.formatMessage(messages.invalidStatus);
      case AppErrorCode.INVALID_URL_FORMAT:
        return intl.formatMessage(messages.invalidUrlFormat);
      case AppErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      case AppErrorCode.UNIQUE:
        return intl.formatMessage(messages.unique);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getAppErrorMessage;
