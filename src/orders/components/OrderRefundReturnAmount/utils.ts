import { IMoney } from "@saleor/components/Money";
import { OrderDetailsFragment, OrderRefundDataQuery } from "@saleor/graphql";
import { FormsetData } from "@saleor/hooks/useFormset";
import {
  getAllFulfillmentLinesPriceSum,
  getPreviouslyRefundedPrice,
  getRefundedLinesPriceSum,
  getReplacedProductsAmount,
  getReturnSelectedProductsAmount,
} from "@saleor/orders/utils/data";

import { OrderRefundFormData } from "../OrderRefundPage/form";
import { LineItemData, OrderReturnFormData } from "../OrderReturnPage/form";
import { OrderRefundAmountValuesProps } from "./OrderRefundReturnAmountValues";

export const getMiscellaneousAmountValues = (
  order: OrderRefundDataQuery["order"],
): OrderRefundAmountValuesProps => {
  const authorizedAmount = order?.total?.gross;
  const previouslyRefunded = getPreviouslyRefundedPrice(order);
  const maxRefund = order?.totalCaptured;

  return {
    authorizedAmount,
    maxRefund,
    previouslyRefunded,
  };
};

const getAuthorizedAmount = (order: OrderRefundDataQuery["order"]) =>
  order?.total?.gross;

const getShipmentCost = (order: OrderRefundDataQuery["order"]) =>
  getAuthorizedAmount(order)?.currency &&
  (order?.shippingPrice?.gross || {
    amount: 0,
    currency: getAuthorizedAmount(order)?.currency,
  });

const getMaxRefund = (order: OrderRefundDataQuery["order"]) =>
  order?.totalCaptured;

export const getProductsAmountValues = ({
  order,
  fulfilledItemsQuantities,
  waitingItemsQuantities,
  unfulfilledItemsQuantities,
  refundShipmentCosts,
}: {
  order: OrderRefundDataQuery["order"];
  fulfilledItemsQuantities: FormsetData<null | LineItemData, string | number>;
  waitingItemsQuantities: FormsetData<null | LineItemData, string | number>;
  unfulfilledItemsQuantities: FormsetData<null | LineItemData, string | number>;
  refundShipmentCosts: any;
}): OrderRefundAmountValuesProps => {
  const authorizedAmount = getAuthorizedAmount(order);
  const shipmentCost = getShipmentCost(order);

  const previouslyRefunded = getPreviouslyRefundedPrice(order);
  const maxRefund = getMaxRefund(order);
  const refundedLinesSum = getRefundedLinesPriceSum(
    order?.lines,
    unfulfilledItemsQuantities as FormsetData<null, string>,
  );
  const waitingLinesSum = getAllFulfillmentLinesPriceSum(
    order?.fulfillments,
    waitingItemsQuantities as FormsetData<null, string>,
  );
  const allFulfillmentLinesSum = getAllFulfillmentLinesPriceSum(
    order?.fulfillments,
    fulfilledItemsQuantities as FormsetData<null, string>,
  );
  const allLinesSum =
    refundedLinesSum + allFulfillmentLinesSum + waitingLinesSum;
  const calculatedTotalAmount = getCalculatedTotalAmount({
    allLinesSum,
    maxRefund,
    previouslyRefunded,
    shipmentCost,
    shipmentCosts: refundShipmentCosts,
  });

  const selectedProductsValue = authorizedAmount?.currency && {
    amount: allLinesSum,
    currency: authorizedAmount.currency,
  };

  const proposedRefundAmount = authorizedAmount?.currency && {
    amount: calculatedTotalAmount,
    currency: authorizedAmount.currency,
  };
  const refundTotalAmount = authorizedAmount?.currency && {
    amount: calculatedTotalAmount,
    currency: authorizedAmount.currency,
  };

  return {
    authorizedAmount,
    maxRefund,
    previouslyRefunded,
    proposedRefundAmount,
    refundTotalAmount,
    selectedProductsValue,
    shipmentCost,
  };
};

const getCalculatedTotalAmount = ({
  shipmentCost,
  shipmentCosts,
  allLinesSum,
  maxRefund,
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

  return calculatedTotalAmount;
};

const getReturnTotalAmount = ({
  selectedProductsValue,
  refundShipmentCosts,
  order,
  maxRefund,
}: {
  order: OrderDetailsFragment;
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
  order: OrderDetailsFragment,
  formData: OrderReturnFormData,
) => {
  const authorizedAmount = getAuthorizedAmount(order);

  const {
    fulfilledItemsQuantities,
    waitingItemsQuantities,
    unfulfilledItemsQuantities,
    refundShipmentCosts,
  } = formData;

  const replacedProductsValue = authorizedAmount?.currency && {
    amount: getReplacedProductsAmount(order, formData),
    currency: authorizedAmount.currency,
  };

  const selectedProductsValue = authorizedAmount?.currency && {
    amount: getReturnSelectedProductsAmount(order, formData),
    currency: authorizedAmount.currency,
  };

  const refundTotalAmount = authorizedAmount?.currency && {
    amount: getReturnTotalAmount({
      maxRefund: getMaxRefund(order),
      order,
      refundShipmentCosts,
      selectedProductsValue,
    }),
    currency: authorizedAmount.currency,
  };

  return {
    ...getProductsAmountValues({
      order,
      fulfilledItemsQuantities,
      waitingItemsQuantities,
      unfulfilledItemsQuantities,
      refundShipmentCosts,
    }),
    refundTotalAmount,
    replacedProductsValue,
    selectedProductsValue,
  };
};

export const getRefundProductsAmountValues = (
  order: OrderRefundDataQuery["order"],
  {
    refundedFulfilledProductQuantities,
    refundShipmentCosts,
    refundedProductQuantities,
  }: OrderRefundFormData,
) =>
  getProductsAmountValues({
    order,
    fulfilledItemsQuantities: refundedFulfilledProductQuantities,
    waitingItemsQuantities: [],
    unfulfilledItemsQuantities: refundedProductQuantities,
    refundShipmentCosts,
  });
