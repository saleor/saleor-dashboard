import { DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import {
  OrderDetailsGrantRefundFragment,
  OrderGrantedRefundStatusEnum,
  TransactionActionEnum,
} from "@dashboard/graphql";
import { ConfirmButtonTransitionState, SavebarLabels } from "@saleor/macaw-ui";
import React from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { IntlShape } from "react-intl";

import {
  orderTransactionRefundMessages,
  refundSavebarMessages,
  refundStatusMessages,
} from "./messages";
import { LineToRefund, OrderTransactionRefundPageFormData } from "./OrderTransactionRefundPage";

export const getDefaultTransaction = (
  transactions: OrderDetailsGrantRefundFragment["transactions"] | undefined,
) =>
  transactions?.find(transaction => transaction.actions.includes(TransactionActionEnum.REFUND))?.id;

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
    linesToRefund: getRefundEditOrderLinesToRefund(order, draftRefund) ?? [],
    transactionId: draftRefund.transaction?.id ?? getDefaultTransaction(order?.transactions),
    includeShipping: draftRefund.shippingCostsIncluded,
    amount: draftRefund.amount.amount,
    reason: draftRefund.reason ?? "",
  };
};

export const getRefundEditOrderLinesToRefund = (
  order: OrderDetailsGrantRefundFragment | undefined | null,
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined,
) => {
  const lines = order?.lines.map((line, index) => ({
    id: line.id,
    index,
  }));
  const refundLines = draftRefund?.lines?.map(line => ({
    id: line.orderLine.id,
    quantity: line.quantity,
    reason: line.reason,
  }));

  return refundLines?.map(refundLine => {
    const line = lines?.find(line => line.id === refundLine.id);

    return {
      row: line?.index ?? 0,
      reason: refundLine?.reason ?? "",
      quantity: refundLine.quantity,
    };
  });
};

export const getRefundCreateDefaultValues = (
  order: OrderDetailsGrantRefundFragment | undefined | null,
): OrderTransactionRefundPageFormData => ({
  linesToRefund: [],
  transactionId: getDefaultTransaction(order?.transactions),
  includeShipping: false,
  amount: 0,
  reason: "",
});

export const canRefundShipping = (
  order: OrderDetailsGrantRefundFragment | undefined | null,
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined,
) => {
  const refundWithShipping = order?.grantedRefunds.find(refund => refund.shippingCostsIncluded);

  if (!refundWithShipping) {
    return true;
  }

  if (refundWithShipping.id === draftRefund?.id) {
    return true;
  }

  return false;
};

export interface ValidateQtyParams {
  update: DatagridChangeOpts["currentUpdate"];
  order: OrderDetailsGrantRefundFragment | undefined | null;
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined;
}
export const validateQty = ({
  update,
  order,
  draftRefund,
}: {
  update: DatagridChangeOpts["currentUpdate"];
  order: OrderDetailsGrantRefundFragment | undefined | null;
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined;
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

  const maxQtyToRefund = getMaxQtyToRefund({
    rowData: order.lines[update.row],
    order,
    draftRefund,
  });

  if (value > maxQtyToRefund) {
    return maxQtyToRefund;
  }

  return value;
};

const calucalteLineToRefundChangeValue = ({
  data,
  order,
  linesToRefund,
  draftRefund,
}: {
  data: DatagridChangeOpts;
  linesToRefund: LineToRefund[];
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined;
  order: OrderDetailsGrantRefundFragment | undefined | null;
}): LineToRefund => {
  const rowId = data.currentUpdate!.row;
  const lineToRefund = linesToRefund.find(line => line.row === rowId);

  if (data.currentUpdate!.column === "reason") {
    return {
      row: rowId,
      reason: data.currentUpdate!.data,
      quantity: lineToRefund?.quantity ?? 0,
      isDirty: true,
    };
  }

  return {
    row: rowId,
    reason: lineToRefund?.reason ?? "",
    quantity: validateQty({
      update: data.currentUpdate!,
      order,
      draftRefund,
    }),
    isDirty: true,
  };
};

export const handleLinesToRefundChange = ({
  data,
  linesToRefund,
  order,
  draftRefund,
  setValue,
}: {
  data: DatagridChangeOpts;
  linesToRefund: LineToRefund[];
  order: OrderDetailsGrantRefundFragment | undefined | null;
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined;
  setValue: UseFormSetValue<OrderTransactionRefundPageFormData>;
}) => {
  const unchangedLines = linesToRefund.filter(qty => qty.row !== data.currentUpdate?.row);

  if (data.currentUpdate) {
    setValue(
      "linesToRefund",
      [
        ...unchangedLines,
        calucalteLineToRefundChangeValue({
          data,
          linesToRefund,
          draftRefund,
          order,
        }),
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
  linesToRefund,
  isFormDirty,
}: {
  getValues: UseFormGetValues<OrderTransactionRefundPageFormData>;
  setValue: UseFormSetValue<OrderTransactionRefundPageFormData>;
  includeShipping: boolean;
  order: OrderDetailsGrantRefundFragment | undefined | null;
  selectedProductsValue: number;
  linesToRefund: LineToRefund[];
  isFormDirty: boolean;
}) => {
  React.useEffect(() => {
    if (isFormDirty) {
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
    }
  }, [linesToRefund, includeShipping]);
};

export const getSelectedProductsValue = ({
  linesToRefund,
  order,
}: {
  linesToRefund: LineToRefund[];
  order: OrderDetailsGrantRefundFragment | undefined | null;
}) => {
  return linesToRefund?.reduce((acc, curr) => {
    const unitPrice: number = order?.lines[curr.row].unitPrice.gross.amount ?? 0;
    const totalPrice = (unitPrice ?? 0) * curr.quantity;

    return acc + totalPrice;
  }, 0);
};

export const createSetMaxQty = ({
  order,
  draftRefund,
  linesToRefund,
  setValue,
}: {
  order: OrderDetailsGrantRefundFragment | undefined | null;
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined;
  linesToRefund: LineToRefund[];
  setValue: UseFormSetValue<OrderTransactionRefundPageFormData>;
}) => {
  return (rows: number[]) => {
    if (!order) {
      return;
    }

    const unchangedQuantites = linesToRefund.filter(qty => !rows.includes(qty.row));
    const newQtyToRefund = rows.map(row => ({
      row,
      reason: linesToRefund[row]?.reason ?? "",
      quantity: getMaxQtyToRefund({
        rowData: order.lines[row],
        order,
        draftRefund,
      }),
    }));

    setValue("linesToRefund", [...unchangedQuantites, ...newQtyToRefund], {
      shouldDirty: true,
    });
  };
};

export const getRefundViewTitle = (
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined,
  intl: IntlShape,
) => {
  return intl.formatMessage(
    draftRefund
      ? orderTransactionRefundMessages.editRefundTitle
      : orderTransactionRefundMessages.createRefundTitle,
  );
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

export const getRefundStatusLabel = (status: OrderGrantedRefundStatusEnum, intl: IntlShape) => {
  switch (status) {
    case OrderGrantedRefundStatusEnum.SUCCESS:
      return intl.formatMessage(refundStatusMessages.success);
    case OrderGrantedRefundStatusEnum.FAILURE:
      return intl.formatMessage(refundStatusMessages.failure);
    case OrderGrantedRefundStatusEnum.PENDING:
      return intl.formatMessage(refundStatusMessages.pending);
    default:
      return intl.formatMessage(refundStatusMessages.draft);
  }
};

export const getMaxQtyToRefund = ({
  rowData,
  order,
  draftRefund,
}: {
  rowData:
    | {
        id: string;
        quantity: number;
      }
    | undefined;
  order: OrderDetailsGrantRefundFragment | undefined | null;
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined;
}) => {
  if (!rowData || !order) {
    return 0;
  }

  const otherGrantedRefunds = draftRefund
    ? order.grantedRefunds.filter(refund => refund.id !== draftRefund?.id)
    : order.grantedRefunds;

  const otherRefundedQty = otherGrantedRefunds.reduce((acc, refund) => {
    return acc + (refund.lines?.find(line => line.orderLine.id === rowData.id)?.quantity ?? 0);
  }, 0);

  return rowData.quantity - otherRefundedQty;
};

interface TransactionRefundFormSubmitBehavior {
  onSubmit: (submitData: OrderTransactionRefundPageFormData) => void;
  submitState: ConfirmButtonTransitionState;
  submitLabels: Partial<SavebarLabels>;
}
export const getRefundFormSubmitBehavior = ({
  canHandlePayments,
  isDirty,
  isEdit,
  onTransferFundsState,
  onSaveDraft,
  onSaveDraftState,
  onTransferFunds,
  intl,
}: {
  canHandlePayments: boolean;
  isDirty: boolean;
  isEdit: boolean;
  onTransferFundsState?: ConfirmButtonTransitionState;
  onSaveDraft: (submitData: OrderTransactionRefundPageFormData) => void;
  onSaveDraftState: ConfirmButtonTransitionState;
  onTransferFunds?: (data: OrderTransactionRefundPageFormData) => void;
  intl: IntlShape;
}): TransactionRefundFormSubmitBehavior => {
  if (!canHandlePayments || isDirty || !isEdit || !onTransferFundsState || !onTransferFunds) {
    return {
      onSubmit: onSaveDraft,
      submitState: onSaveDraftState,
      submitLabels: {
        confirm: intl.formatMessage(refundSavebarMessages.saveDraft),
        cancel: intl.formatMessage(refundSavebarMessages.cancel),
      },
    };
  }

  return {
    onSubmit: onTransferFunds,
    submitState: onTransferFundsState,
    submitLabels: {
      confirm: intl.formatMessage(refundSavebarMessages.transferFunds),
      cancel: intl.formatMessage(refundSavebarMessages.cancel),
    },
  };
};
