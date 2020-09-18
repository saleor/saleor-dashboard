import { PermissionGroupErrorFragment } from "@saleor/fragments/types/PermissionGroupErrorFragment";
import { commonMessages } from "@saleor/intl";
import { PermissionGroupErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
  assignNonStaffMember: {
    defaultMessage: "Only staff members can be assigned"
  },
  cannotRemoveFromLastGroup: {
    defaultMessage: "Cannot remove user from last group"
  },
  duplicatedInputItem: {
    defaultMessage: "Cannot add and remove group the same time"
  },
  permissionOutOfScope: {
    defaultMessage: "Those permissions are out of your scope"
  },
  unique: {
    defaultMessage: "This name should be unique"
  }
});

function getPermissionGroupErrorMessage(
  err: PermissionGroupErrorFragment,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case PermissionGroupErrorCode.ASSIGN_NON_STAFF_MEMBER:
        return intl.formatMessage(messages.assignNonStaffMember);
      case PermissionGroupErrorCode.DUPLICATED_INPUT_ITEM:
        return intl.formatMessage(messages.duplicatedInputItem);
      case PermissionGroupErrorCode.OUT_OF_SCOPE_PERMISSION:
        return intl.formatMessage(messages.permissionOutOfScope);
      case PermissionGroupErrorCode.CANNOT_REMOVE_FROM_LAST_GROUP:
        return intl.formatMessage(messages.cannotRemoveFromLastGroup);
      case PermissionGroupErrorCode.UNIQUE:
        return intl.formatMessage(messages.unique);
      case PermissionGroupErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getPermissionGroupErrorMessage;
