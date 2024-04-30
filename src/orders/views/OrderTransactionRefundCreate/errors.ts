import { IMessage } from "@dashboard/components/messages";
import {
  OrderGrantRefundAddMutation,
  OrderGrantRefundCreateErrorCode,
  OrderGrantRefundCreateErrorFragment,
} from "@dashboard/graphql";
import { OrderTransactionRefundError } from "@dashboard/orders/components/OrderTransactionRefundPage/OrderTransactionRefundPage";

export const handleCreateRefundErrors = ({
  submitData,
  notify,
  setLinesErrors,
}: {
  submitData: OrderGrantRefundAddMutation;
  notify: (message: IMessage) => void;
  setLinesErrors: (value: React.SetStateAction<OrderTransactionRefundError[]>) => void;
}) => {
  const errors = submitData.orderGrantRefundCreate?.errors ?? [];
  const errorLines: OrderTransactionRefundError[] = [];

  errors.forEach((err: OrderGrantRefundCreateErrorFragment) => {
    if (err.code !== OrderGrantRefundCreateErrorCode.REQUIRED) {
      notify({
        status: "error",
        text: err.message,
      });
    }

    errorLines.push({
      code: err.code,
      field: err.field,
      lines: err.lines,
      message: err.message,
    } as OrderTransactionRefundError);
  });

  setLinesErrors(errorLines);
};
