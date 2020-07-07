import { WarehouseErrorFragment } from "@saleor/fragments/types/WarehouseErrorFragment";
import { commonMessages } from "@saleor/intl";
import { WarehouseErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
  slugUnique: {
    defaultMessage: "Slug must be unique for each warehouse",
    description: "error message"
  }
});

function getWarehouseErrorMessage(
  err: Omit<WarehouseErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case WarehouseErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case WarehouseErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      case WarehouseErrorCode.INVALID:
        return intl.formatMessage(commonErrorMessages.invalid);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export function getWarehouseSlugErrorMessage(
  err: Omit<WarehouseErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case WarehouseErrorCode.UNIQUE:
        return intl.formatMessage(messages.slugUnique);
      default:
        return getWarehouseErrorMessage(err, intl);
    }
  }

  return undefined;
}

export default getWarehouseErrorMessage;
