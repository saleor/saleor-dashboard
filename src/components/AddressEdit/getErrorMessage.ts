// @ts-strict-ignore
import { AccountErrorFragment, OrderErrorFragment } from "@dashboard/graphql";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { IntlShape } from "react-intl";

export function getErrorMessage(
  err: AccountErrorFragment | OrderErrorFragment,
  intl: IntlShape,
): string {
  if (err?.message) {
    return err.message;
  }

  if (err?.__typename === "AccountError") {
    return getAccountErrorMessage(err, intl);
  }

  return getOrderErrorMessage(err, intl);
}
