import { IntlShape } from "react-intl";

import { OrderErrorCode } from "@saleor/types/globalTypes";
import { commonMessages } from "@saleor/intl";
import { OrderErrorFragment } from "@saleor/orders/types/OrderErrorFragment";
import commonErrorMessages from "./common";

function getOrderErrorMessage(
  err: OrderErrorFragment,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case OrderErrorCode.GRAPHQL_ERROR:
        return intl.formatMessage(commonErrorMessages.graphqlError);
      case OrderErrorCode.INVALID:
        return intl.formatMessage(commonErrorMessages.invalid);
      case OrderErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getOrderErrorMessage;
