import {
  PermissionGroupErrorCode,
  PermissionGroupErrorFragment,
} from "@saleor/graphql";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  assignNonStaffMember: {
    id: "+x4cZH",
    defaultMessage: "Only staff members can be assigned",
  },
  cannotRemoveFromLastGroup: {
    id: "WzA5Ll",
    defaultMessage: "Cannot remove user from last group",
  },
  duplicatedInputItem: {
    id: "E8T3e+",
    defaultMessage: "Cannot add and remove group the same time",
  },
  permissionOutOfScope: {
    id: "vVviA2",
    defaultMessage: "Those permissions are out of your scope",
  },
  unique: {
    id: "mgFyBA",
    defaultMessage: "This name should be unique",
  },
});

function getPermissionGroupErrorMessage(
  err: PermissionGroupErrorFragment,
  intl: IntlShape,
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
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}

export default getPermissionGroupErrorMessage;
