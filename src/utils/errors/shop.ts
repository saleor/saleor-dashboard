import { ShopErrorCode, ShopErrorFragment } from "@saleor/graphql";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  alreadyExists: {
    id: "m8cjcK",
    defaultMessage: "Authorization key with this type already exists",
    description: "add authorization key error",
  },
});

function getShopErrorMessage(
  err: Omit<ShopErrorFragment, "__typename"> | undefined,
  intl: IntlShape,
): string {
  if (err) {
    switch (err.code) {
      case ShopErrorCode.ALREADY_EXISTS:
        return intl.formatMessage(messages.alreadyExists);
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}

export default getShopErrorMessage;
