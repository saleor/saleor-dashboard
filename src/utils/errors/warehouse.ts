import { WarehouseErrorFragment } from "@saleor/fragments/types/WarehouseErrorFragment";
import { WarehouseErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

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
  return getCommonFormFieldErrorMessage(err, intl);
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
