import { DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import {
  OrderDetailsGrantRefundFragment,
  OrderGrantedRefundStatusEnum,
  TransactionActionEnum,
} from "@dashboard/graphql";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

import {
  OrderTransactionRefundPageFormData,
  QuantityToRefund,
} from "./OrderTransactionRefundPage";

export const getDefaultTransaction = (
  transactions: OrderDetailsGrantRefundFragment["transactions"] | undefined,
) =>
  transactions?.find(transaction =>
    transaction.actions.includes(TransactionActionEnum.REFUND),
  )?.id;

export const getRefundFormDefaultValues = ({
  order,
  draftRefund,
}: {
  order: OrderDetailsGrantRefundFragment | undefined | null;
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined;
}) => {
  if (!draftRefund) {
    return getRefundCreateDefaultValues(order);
  }
  return getRefundEditDefaultValues(order, draftRefund);
};

const getRefundEditDefaultValues = (
  order: OrderDetailsGrantRefundFragment | undefined | null,
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0],
): OrderTransactionRefundPageFormData => {
  return {
    qtyToRefund: getRefundEditOrderQty(order, draftRefund) ?? [],
    transactionId:
      draftRefund.transaction?.id ?? getDefaultTransaction(order?.transactions),
    includeShipping: draftRefund.shippingCostsIncluded,
    amount: draftRefund.amount.amount,
    reason: draftRefund.reason ?? "",
  };
};

const getRefundEditOrderQty = (
  order: OrderDetailsGrantRefundFragment | undefined | null,
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0],
) => {
  const lines = order?.lines.map((line, index) => ({
    id: line.id,
    index,
  }));
  const refundLines = draftRefund?.lines?.map(line => ({
    id: line.orderLine.id,
    quantity: line.quantity,
  }));
  return refundLines?.map(refundLine => {
    const line = lines?.find(line => line.id === refundLine.id);
    return {
      row: line?.index ?? 0,
      value: refundLine.quantity,
    };
  });
};

export const getRefundCreateDefaultValues = (
  order: OrderDetailsGrantRefundFragment | undefined | null,
): OrderTransactionRefundPageFormData => ({
  qtyToRefund: [],
  transactionId: getDefaultTransaction(order?.transactions),
  includeShipping: false,
  amount: 0,
  reason: "",
});

export const canRefundShipping = (
  order: OrderDetailsGrantRefundFragment | undefined | null,
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined,
) => {
  const refundWithShipping = order?.grantedRefunds.find(
    refund => refund.shippingCostsIncluded,
  );
  if (!refundWithShipping) {
    return true;
  }
  if (refundWithShipping.id === draftRefund?.id) {
    return true;
  }
  return false;
};

const validateQty = ({
  update,
  order,
}: {
  update: DatagridChangeOpts["currentUpdate"];
  order: OrderDetailsGrantRefundFragment | undefined | null;
}) => {
  if (!update?.data.value || !order) {
    return 0;
  }
  const value = parseInt(update.data.value);
  if (isNaN(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > order.lines[update.row].quantity) {
    return order.lines[update.row].quantity;
  }
  return value;
};

export const handleQtyToRefundChange = ({
  data,
  qtyToRefund,
  order,
  setValue,
}: {
  data: DatagridChangeOpts;
  qtyToRefund: QuantityToRefund[];
  order: OrderDetailsGrantRefundFragment | undefined | null;
  setValue: UseFormSetValue<OrderTransactionRefundPageFormData>;
}) => {
  const unchangedQuantites = qtyToRefund.filter(
    qty => qty.row !== data.currentUpdate?.row,
  );

  if (data.currentUpdate) {
    setValue(
      "qtyToRefund",
      [
        ...unchangedQuantites,
        {
          row: data.currentUpdate.row,
          value: validateQty({
            update: data.currentUpdate,
            order,
          }),
        },
      ],
      { shouldDirty: true },
    );
  }
};

export const useRecalculateTotalAmount = ({
  getValues,
  setValue,
  includeShipping,
  order,
  selectedProductsValue,
  qtyToRefund,
}: {
  getValues: UseFormGetValues<OrderTransactionRefundPageFormData>;
  setValue: UseFormSetValue<OrderTransactionRefundPageFormData>;
  includeShipping: boolean;
  order: OrderDetailsGrantRefundFragment | undefined | null;
  selectedProductsValue: number;
  qtyToRefund: QuantityToRefund[];
}) => {
  React.useEffect(() => {
    const customAmount = getValues("amount");
    if (includeShipping) {
      const shippingPrice = order?.shippingPrice.gross.amount;
      const totalAmount = selectedProductsValue + (shippingPrice ?? 0);
      if (totalAmount !== customAmount) {
        setValue("amount", totalAmount);
      }
      return;
    }

    if (selectedProductsValue !== customAmount) {
      setValue("amount", selectedProductsValue);
    }
  }, [qtyToRefund, includeShipping]);
};

export const getSelectedProductsValue = ({
  qtyToRefund,
  order,
}: {
  qtyToRefund: QuantityToRefund[];
  order: OrderDetailsGrantRefundFragment | undefined | null;
}) => {
  return qtyToRefund?.reduce((acc, curr) => {
    const unitPrice: number =
      order?.lines[curr.row].unitPrice.gross.amount ?? 0;
    const totalPrice = unitPrice ?? 0 * curr.value;
    return acc + totalPrice;
  }, 0);
};

export const createSetMaxQty = ({
  order,
  qtyToRefund,
  setValue,
}: {
  order: OrderDetailsGrantRefundFragment | undefined | null;
  qtyToRefund: QuantityToRefund[];
  setValue: UseFormSetValue<OrderTransactionRefundPageFormData>;
}) => {
  return (rows: number[]) => {
    if (!order) {
      return;
    }
    const unchangedQuantites = qtyToRefund.filter(
      qty => !rows.includes(qty.row),
    );
    const newQtyToRefund = rows.map(row => ({
      row,
      value: order.lines[row].quantity,
    }));
    setValue("qtyToRefund", [...unchangedQuantites, ...newQtyToRefund], {
      shouldDirty: true,
    });
  };
};

export const getSavebarLabels = ({
  isDirty,
  isEdit,
  canHandlePayments,
}: {
  isDirty: boolean;
  isEdit: boolean;
  canHandlePayments: boolean;
}) => {
  if (!canHandlePayments || isDirty || !isEdit) {
    return {
      confirm: "Save draft",
      cancel: "Cancel",
    };
  }

  return {
    confirm: "Transfer funds",
    cancel: "Cancel",
  };
};

export const getRefundViewTitle = (
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined,
) => {
  return draftRefund ? "Edit refund" : "Create refund";
};

export const getSavebarState = ({
  isEdit,
  isDirty,
  canHandlePayments,
  onSaveDraftState,
  onTransferFundsState,
}: {
  isEdit: boolean;
  isDirty: boolean;
  canHandlePayments: boolean;
  onSaveDraftState: ConfirmButtonTransitionState;
  onTransferFundsState: ConfirmButtonTransitionState | undefined;
}) => {
  if (!canHandlePayments || isDirty || !isEdit || !onTransferFundsState) {
    return onSaveDraftState;
  }
  return onTransferFundsState;
};

export const getRefundStatusColor = (status: OrderGrantedRefundStatusEnum) => {
  switch (status) {
    case OrderGrantedRefundStatusEnum.SUCCESS:
      return "success";
    case OrderGrantedRefundStatusEnum.FAILURE:
      return "error";
    case OrderGrantedRefundStatusEnum.PENDING:
      return "warning";
    default:
      return "generic";
  }
};

export const getRefundStatusLabel = (status: OrderGrantedRefundStatusEnum) => {
  switch (status) {
    case OrderGrantedRefundStatusEnum.SUCCESS:
      return "Success";
    case OrderGrantedRefundStatusEnum.FAILURE:
      return "Failure";
    case OrderGrantedRefundStatusEnum.PENDING:
      return "Pending";
    default:
      return "Draft";
  }
};
