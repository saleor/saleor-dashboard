import { DiscountErrorCode, DiscountErrorFragment } from "@saleor/graphql";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  alreadyExists: {
    id: "stjHjY",
    defaultMessage: "Promo code already exists",
    description: "error message",
  },
});

function getDiscountErrorMessage(
  err: Omit<DiscountErrorFragment, "__typename"> | undefined,
  intl: IntlShape,
): string {
  if (err) {
    switch (err.code) {
      case DiscountErrorCode.ALREADY_EXISTS:
        return intl.formatMessage(messages.alreadyExists);
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}

export default getDiscountErrorMessage;
