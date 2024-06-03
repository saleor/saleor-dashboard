import { IMessage } from "@dashboard/components/messages";
import {
  OrderGrantRefundEditMutation,
  OrderGrantRefundUpdateErrorCode,
  OrderGrantRefundUpdateErrorFragment,
} from "@dashboard/graphql";
import { OrderTransactionRefundError } from "@dashboard/orders/components/OrderTransactionRefundPage/OrderTransactionRefundPage";
import { IntlShape } from "react-intl";

import { transactionRefundEditMessages } from "./messages";

export const handleRefundEditComplete = ({
  submitData,
  notify,
  setLinesErrors,
  intl,
}: {
  submitData: OrderGrantRefundEditMutation;
  notify: (message: IMessage) => void;
  setLinesErrors: (value: React.SetStateAction<OrderTransactionRefundError[]>) => void;
  intl: IntlShape;
  orderId: string;
}) => {
  const errors = submitData.orderGrantRefundUpdate?.errors ?? [];
  const errorLines: OrderTransactionRefundError[] = [];

  if (errors.length === 0) {
    notify({
      status: "success",
      text: intl.formatMessage(transactionRefundEditMessages.savedDraft),
    });
    setLinesErrors([]);

    return;
  }

  if (errors.length > 0) {
    errors.forEach((err: OrderGrantRefundUpdateErrorFragment) => {
      if (
        ![
          OrderGrantRefundUpdateErrorCode.REQUIRED,
          OrderGrantRefundUpdateErrorCode.AMOUNT_GREATER_THAN_AVAILABLE,
        ].includes(err.code)
      ) {
        notify({
          status: "error",
          text: err.message,
        });
      }

      errorLines.push({
        code: err.code,
        field: err.field,
        lines: err.addLines,
        message: err.message,
      } as OrderTransactionRefundError);

      setLinesErrors(errorLines);
    });
  }
};
