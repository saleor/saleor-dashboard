import { AppErrorCode, AppErrorFragment } from "@dashboard/graphql";
import { getCommonFormFieldErrorMessage } from "@dashboard/utils/errors/common";
import { IntlShape } from "react-intl";

import { appManifestErrorMessages } from "./messages";

export function getAppInstallErrorMessage(
  err: AppErrorFragment,
  intl: IntlShape,
): string | undefined {
  if (err) {
    switch (err.code) {
      case AppErrorCode.INVALID_MANIFEST_FORMAT:
        return intl.formatMessage(appManifestErrorMessages.invalidManifestFormat);
      case AppErrorCode.OUT_OF_SCOPE_APP:
        return intl.formatMessage(appManifestErrorMessages.outOfScopeApp);
      case AppErrorCode.OUT_OF_SCOPE_PERMISSION:
        return intl.formatMessage(appManifestErrorMessages.outOfScopePermission);
      case AppErrorCode.INVALID_PERMISSION:
        return intl.formatMessage(appManifestErrorMessages.invalidPermission);
      case AppErrorCode.INVALID_STATUS:
        return intl.formatMessage(appManifestErrorMessages.invalidStatus);
      case AppErrorCode.INVALID_URL_FORMAT:
        return intl.formatMessage(appManifestErrorMessages.invalidUrlFormat);
      case AppErrorCode.UNIQUE:
        return intl.formatMessage(appManifestErrorMessages.unique);
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}
