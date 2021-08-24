import { BulkStockErrorFragment } from "@saleor/fragments/types/BulkStockErrorFragment";
import { StockErrorFragment } from "@saleor/fragments/types/StockErrorFragment";
import { StockErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";
import getProductErrorMessage from "./product";

const messages = defineMessages({
  slugUnique: {
    defaultMessage:
      "Stock for this warehouse already exists for this product variant",
    description: "error message"
  }
});

function getStockErrorMessage(
  err: Omit<StockErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case StockErrorCode.UNIQUE:
        return intl.formatMessage(messages.slugUnique);
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}

export function getBulkStockErrorMessage(
  err: Omit<BulkStockErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  return getProductErrorMessage(err, intl);
}

export default getStockErrorMessage;
