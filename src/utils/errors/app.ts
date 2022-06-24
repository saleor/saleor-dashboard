import { AppErrorCode, AppErrorFragment } from "@saleor/graphql";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  invalidManifestFormat: {
    id: "pC6/1z",
    defaultMessage: "Invalid manifest format",
  },
  invalidPermission: {
    id: "D2qihU",
    defaultMessage: "Permission is invalid",
  },
  invalidStatus: {
    id: "v3WWK+",
    defaultMessage: "Status is invalid",
  },
  invalidUrlFormat: {
    id: "g/BrOt",
    defaultMessage: "Url has invalid format",
  },
  outOfScopeApp: {
    id: "C4hCsD",
    defaultMessage: "App is out of your permissions scope",
  },
  outOfScopeGroup: {
    id: "1n1tOR",
    defaultMessage: "Group is out of your permission scope",
  },
  outOfScopePermission: {
    id: "4prRLv",
    defaultMessage: "Permission is out of your scope",
  },
  unique: {
    id: "TDhHMi",
    defaultMessage: "This needs to be unique",
  },
});

function getAppErrorMessage(err: AppErrorFragment, intl: IntlShape): string {
  if (err) {
    switch (err.code) {
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
      case AppErrorCode.UNIQUE:
        return intl.formatMessage(messages.unique);
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}

export default getAppErrorMessage;
