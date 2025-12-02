import { OrderDetailsGrantRefundFragment, OrderGrantedRefundStatusEnum } from "@dashboard/graphql";
import { ConfirmButtonTransitionState, SavebarLabels } from "@saleor/macaw-ui";
import { useEffect } from "react";
import { UseFieldArrayUpdate, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { IntlShape } from "react-intl";

import {
  orderTransactionRefundMessages,
  refundSavebarMessages,
  refundStatusMessages,
} from "./messages";
import { LineToRefund, OrderTransactionRefundPageFormData } from "./OrderTransactionRefundPage";

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

function parseStringOrNumber(value: number | string): number {
  if (typeof value === "number") {
    return value;
  }

  const parsed = parseInt(value, 10);

  return parsed;
}
export const validateQty = ({
  update,
  order,
  draftRefund,
}: {
  update: RefundQuantityChange;
  order: OrderDetailsGrantRefundFragment | undefined | null;
  draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined;
}) => {
  if (!update?.value || !order) {
    return "";
  }

  const value = parseStringOrNumber(update.value);

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

export interface RefundQuantityChange {
  row: number;
  value: number | string;
}
export const handleLinesToRefundChange = ({
  data,
  index,
  linesToRefund,
  setValue,
}: {
  data: RefundQuantityChange;
  index: number;
  linesToRefund: LineToRefund[];
  setValue: UseFormSetValue<OrderTransactionRefundPageFormData>;
}) => {
  const line = linesToRefund[index];

  setValue(
    `linesToRefund.${index}`,
    {
      ...line,
      quantity: data.value,
    },
    { shouldDirty: true },
  );
};

export const handleReasonChange = ({
  reason,
  index,
  linesToRefund,
  refundFieldsUpdate,
}: {
  reason: string;
  index: number;
  linesToRefund: LineToRefund[];
  refundFieldsUpdate: UseFieldArrayUpdate<OrderTransactionRefundPageFormData, "linesToRefund">;
}) => {
  refundFieldsUpdate(index, { quantity: linesToRefund[index].quantity, reason });
};

const roundToTwoDecimals = (num: number) => {
  return parseFloat(num.toFixed(2));
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
  useEffect(() => {
    if (isFormDirty) {
      const customAmount = getValues("amount");

      if (includeShipping) {
        const shippingPrice = order?.shippingPrice.gross.amount;
        const totalAmount = roundToTwoDecimals(selectedProductsValue + (shippingPrice ?? 0));

        if (totalAmount !== customAmount) {
          setValue("amount", totalAmount);
        }

        return;
      }

      const roundedSelectedProductsValue = roundToTwoDecimals(selectedProductsValue);

      if (roundedSelectedProductsValue !== customAmount) {
        setValue("amount", roundedSelectedProductsValue);
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
  return linesToRefund?.reduce((acc, curr, ix) => {
    const unitPrice: number = order?.lines[ix].unitPrice.gross.amount ?? 0;

    if (typeof curr.quantity !== "number" || isNaN(curr.quantity)) {
      return acc;
    }

    const totalPrice = (unitPrice ?? 0) * curr.quantity;

    return acc + totalPrice;
  }, 0);
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
      return "neutral";
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
