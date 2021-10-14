import { IMoney } from "@saleor/components/Money";
import { FormsetData } from "@saleor/hooks/useFormset";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import {
  OrderRefundData_order,
  OrderRefundData_order_payments
} from "@saleor/orders/types/OrderRefundData";
import {
  getAllFulfillmentLinesPriceSum,
  getPaymentsTotalAmount,
  getPreviouslyRefundedPrice,
  getRefundedLinesPriceSum,
  getReplacedProductsAmount,
  getReturnSelectedProductsAmount
} from "@saleor/orders/utils/data";

import { OrderRefundFormData } from "../OrderRefundPage/form";
import { LineItemData, OrderReturnFormData } from "../OrderReturnPage/form";
import { OrderRefundAmountValuesProps } from "./OrderRefundReturnAmountValues";

export const getMiscellaneousAmountValues = (
  order: OrderRefundData_order,
  { paymentsToRefund }: OrderRefundFormData
): OrderRefundAmountValuesProps => {
  const authorizedAmount = order?.total?.gross;
  const previouslyRefunded = getPreviouslyRefundedPrice(order);
  const maxRefund = order?.totalCaptured;
  const paymentsTotalAmount = authorizedAmount?.currency && {
    amount: getPaymentsTotalAmount(paymentsToRefund),
    currency: authorizedAmount.currency
  };

  return {
    authorizedAmount,
    maxRefund,
    previouslyRefunded,
    paymentsTotalAmount
  };
};

const getAuthorizedAmount = (order: OrderRefundData_order) =>
  order?.total?.gross;

const getShipmentCost = (order: OrderRefundData_order) =>
  getAuthorizedAmount(order)?.currency &&
  (order?.shippingPrice?.gross || {
    amount: 0,
    currency: getAuthorizedAmount(order)?.currency
  });

const getMaxRefund = (order: OrderRefundData_order) => order?.totalCaptured;

export const getProductsAmountValues = (
  order: OrderRefundData_order,
  fulfilledItemsQuantities: FormsetData<null | LineItemData, string | number>,
  unfulfilledItemsQuantities: FormsetData<null | LineItemData, string | number>,
  shipmentCosts,
  paymentsToRefund: FormsetData<null | LineItemData, string | number>
): OrderRefundAmountValuesProps => {
  const authorizedAmount = getAuthorizedAmount(order);
  const shipmentCost = getShipmentCost(order);

  const previouslyRefunded = getPreviouslyRefundedPrice(order);
  const maxRefund = getMaxRefund(order);
  const refundedLinesSum = getRefundedLinesPriceSum(
    order?.lines,
    unfulfilledItemsQuantities as FormsetData<null, string>
  );
  const allFulfillmentLinesSum = getAllFulfillmentLinesPriceSum(
    order?.fulfillments,
    fulfilledItemsQuantities as FormsetData<null, string>
  );
  const allLinesSum = refundedLinesSum + allFulfillmentLinesSum;
  const calculatedTotalAmount = getCalculatedTotalAmount({
    allLinesSum,
    maxRefund,
    previouslyRefunded,
    shipmentCost,
    shipmentCosts
  });

  const selectedProductsValue = authorizedAmount?.currency && {
    amount: allLinesSum,
    currency: authorizedAmount.currency
  };

  const proposedRefundAmount = authorizedAmount?.currency && {
    amount: calculatedTotalAmount,
    currency: authorizedAmount.currency
  };
  const refundTotalAmount = authorizedAmount?.currency && {
    amount: calculatedTotalAmount,
    currency: authorizedAmount.currency
  };

  const paymentsTotalAmount = authorizedAmount?.currency && {
    amount: getPaymentsTotalAmount(paymentsToRefund),
    currency: authorizedAmount.currency
  };

  const remainingBalance = authorizedAmount?.currency && {
    amount: calculatedTotalAmount - paymentsTotalAmount.amount,
    currency: authorizedAmount.currency
  };

  return {
    authorizedAmount,
    maxRefund,
    previouslyRefunded,
    proposedRefundAmount,
    refundTotalAmount,
    selectedProductsValue,
    shipmentCost,
    remainingBalance,
    paymentsTotalAmount
  };
};

const getCalculatedTotalAmount = ({
  shipmentCost,
  shipmentCosts,
  allLinesSum,
  maxRefund
}: {
  shipmentCost: IMoney;
  shipmentCosts: IMoney;
  allLinesSum: number;
  previouslyRefunded: IMoney;
  maxRefund: IMoney;
}) => {
  if (maxRefund?.amount === 0) {
    return 0;
  }

  const shipmentCostValue = shipmentCost ? shipmentCost.amount : 0;

  const calculatedTotalAmount = shipmentCosts
    ? allLinesSum + shipmentCostValue
    : allLinesSum;

  return Number(calculatedTotalAmount.toFixed(2));
};

const getReturnTotalAmount = ({
  selectedProductsValue,
  refundShipmentCosts,
  order,
  maxRefund
}: {
  order: OrderDetails_order;
  selectedProductsValue: IMoney;
  refundShipmentCosts: boolean;
  maxRefund: IMoney;
}) => {
  if (maxRefund?.amount === 0) {
    return 0;
  }

  if (refundShipmentCosts) {
    const totalValue =
      selectedProductsValue?.amount + getShipmentCost(order)?.amount;
    return totalValue || 0;
  }

  return selectedProductsValue?.amount || 0;
};

export const getReturnProductsAmountValues = (
  order: OrderDetails_order,
  formData: OrderReturnFormData
) => {
  const authorizedAmount = getAuthorizedAmount(order);

  const {
    fulfilledItemsQuantities,
    unfulfilledItemsQuantities,
    refundShipmentCosts,
    paymentsToRefund
  } = formData;

  const replacedProductsValue = authorizedAmount?.currency && {
    amount: getReplacedProductsAmount(order, formData),
    currency: authorizedAmount.currency
  };

  const selectedProductsValue = authorizedAmount?.currency && {
    amount: getReturnSelectedProductsAmount(order, formData),
    currency: authorizedAmount.currency
  };

  const refundTotalAmount = authorizedAmount?.currency && {
    amount: getReturnTotalAmount({
      maxRefund: getMaxRefund(order),
      order,
      refundShipmentCosts,
      selectedProductsValue
    }),
    currency: authorizedAmount.currency
  };

  return {
    ...getProductsAmountValues(
      order,
      fulfilledItemsQuantities,
      unfulfilledItemsQuantities,
      refundShipmentCosts,
      paymentsToRefund
    ),
    refundTotalAmount,
    replacedProductsValue,
    selectedProductsValue
  };
};

export const getRefundProductsAmountValues = (
  order: OrderRefundData_order,
  {
    refundedFulfilledProductQuantities,
    refundShipmentCosts,
    refundedProductQuantities,
    paymentsToRefund
  }: OrderRefundFormData
) =>
  getProductsAmountValues(
    order,
    refundedFulfilledProductQuantities,
    refundedProductQuantities,
    refundShipmentCosts,
    paymentsToRefund
  );

export const getPaymentsAmount = (
  refundTotalAmount: IMoney,
  payments: OrderRefundData_order_payments[]
) => {
  const amounts = [];
  let remainingAmount = (refundTotalAmount && refundTotalAmount.amount) || 0.0;
  for (const payment of payments) {
    const amount =
      remainingAmount >= payment.capturedAmount.amount
        ? payment.capturedAmount.amount
        : remainingAmount > 0
        ? remainingAmount
        : 0;

    remainingAmount -= amount;
    amounts.push({
      id: payment.id,
      amount,
      currency: payment.capturedAmount.currency
    });
  }
  return amounts;
};
