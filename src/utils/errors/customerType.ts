import {
  CustomerTypeAssignAttributesErrorCode,
  type CustomerTypeAssignAttributesErrorFragment,
  CustomerTypeCreateErrorCode,
  type CustomerTypeCreateErrorFragment,
  CustomerTypeDeleteErrorCode,
  type CustomerTypeDeleteErrorFragment,
  CustomerTypeReorderAttributesErrorCode,
  type CustomerTypeReorderAttributesErrorFragment,
  CustomerTypeUnassignAttributesErrorCode,
  type CustomerTypeUnassignAttributesErrorFragment,
  CustomerTypeUpdateErrorCode,
  type CustomerTypeUpdateErrorFragment,
} from "@dashboard/graphql";
import { defineMessages, type IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  nameAlreadyTaken: {
    id: "TRR1ry",
    defaultMessage: "This name is already taken. Please provide another.",
    description: "customer type unique name error",
  },
  slugAlreadyTaken: {
    id: "hqbdaB",
    defaultMessage: "A customer type with this slug already exists. Please provide another.",
    description: "customer type unique slug error",
  },
  cannotUnsetDefault: {
    id: "Vqz/Gs",
    defaultMessage:
      "The default flag cannot be unset. Mark another customer type as the default instead.",
    description: "cannot unset default customer type",
  },
  cannotDeleteDefault: {
    id: "GKk2yy",
    defaultMessage:
      "The default customer type cannot be deleted. Mark another customer type as the default first.",
    description: "cannot delete default customer type",
  },
  attributeAlreadyAssigned: {
    id: "eS3TOX",
    defaultMessage: "This attribute is already assigned.",
    description: "customer type attribute already assigned",
  },
  notFound: {
    id: "Ld9hAH",
    defaultMessage: "Customer type not found.",
    description: "customer type not found error",
  },
});

type CustomerTypeError =
  | CustomerTypeCreateErrorFragment
  | CustomerTypeUpdateErrorFragment
  | CustomerTypeDeleteErrorFragment
  | CustomerTypeAssignAttributesErrorFragment
  | CustomerTypeUnassignAttributesErrorFragment
  | CustomerTypeReorderAttributesErrorFragment;

function getCustomerTypeErrorMessage(
  err: Omit<CustomerTypeError, "__typename"> | undefined,
  intl: IntlShape,
): string | undefined {
  if (err) {
    switch (err.code) {
      case CustomerTypeCreateErrorCode.UNIQUE:
      case CustomerTypeUpdateErrorCode.UNIQUE:
        if (err.field === "slug") {
          return intl.formatMessage(messages.slugAlreadyTaken);
        }

        return intl.formatMessage(messages.nameAlreadyTaken);
      case CustomerTypeUpdateErrorCode.CANNOT_UNSET_DEFAULT:
        return intl.formatMessage(messages.cannotUnsetDefault);
      case CustomerTypeDeleteErrorCode.CANNOT_DELETE_DEFAULT:
        return intl.formatMessage(messages.cannotDeleteDefault);
      case CustomerTypeAssignAttributesErrorCode.ATTRIBUTE_ALREADY_ASSIGNED:
        return intl.formatMessage(messages.attributeAlreadyAssigned);
      case CustomerTypeCreateErrorCode.NOT_FOUND:
      case CustomerTypeUpdateErrorCode.NOT_FOUND:
      case CustomerTypeDeleteErrorCode.NOT_FOUND:
      case CustomerTypeAssignAttributesErrorCode.NOT_FOUND:
      case CustomerTypeUnassignAttributesErrorCode.NOT_FOUND:
      case CustomerTypeReorderAttributesErrorCode.NOT_FOUND:
        return intl.formatMessage(messages.notFound);
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}

export default getCustomerTypeErrorMessage;
