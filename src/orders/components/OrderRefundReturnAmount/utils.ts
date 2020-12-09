import { FormsetData } from "@saleor/hooks/useFormset";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import {
  getAllFulfillmentLinesPriceSum,
  getPreviouslyRefundedPrice,
  getRefundedLinesPriceSum
} from "@saleor/orders/utils/data";

import { OrderRefundFormData } from "../OrderRefundPage/form";
import { OrderReturnFormData } from "../OrderReturnPage/form";
import { OrderRefundAmountValuesProps } from "./OrderRefundReturnAmountValues";

export const getMiscellaneousAmountValues = (
  order: OrderRefundData_order
): OrderRefundAmountValuesProps => {
  const authorizedAmount = order?.total?.gross;
  const previouslyRefunded = getPreviouslyRefundedPrice(order);
  const maxRefund = order?.totalCaptured;

  return {
    authorizedAmount,
    maxRefund,
    previouslyRefunded
  };
};

export const getProductsAmountValues = (
  order: OrderRefundData_order,
  fulfilledItemsQuantities: FormsetData<null, string | number>,
  unfulfilledItemsQuantities: FormsetData<null, string | number>,
  shipmentCosts
): OrderRefundAmountValuesProps => {
  const authorizedAmount = order?.total?.gross;
  const shipmentCost =
    authorizedAmount?.currency &&
    (order?.shippingPrice?.gross || {
      amount: 0,
      currency: authorizedAmount?.currency
    });
  const previouslyRefunded = getPreviouslyRefundedPrice(order);
  const maxRefund = order?.totalCaptured;
  const refundedLinesSum = getRefundedLinesPriceSum(
    order?.lines,
    unfulfilledItemsQuantities
  );
  const allFulfillmentLinesSum = getAllFulfillmentLinesPriceSum(
    order?.fulfillments,
    fulfilledItemsQuantities
  );
  const allLinesSum = refundedLinesSum + allFulfillmentLinesSum;
  const calculatedTotalAmount = shipmentCosts
    ? allLinesSum + shipmentCost?.amount
    : allLinesSum;
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

  return {
    authorizedAmount,
    maxRefund,
    previouslyRefunded,
    proposedRefundAmount,
    refundTotalAmount,
    selectedProductsValue,
    shipmentCost
  };
};

export const getReturnProductsAmountValues = (
  order: OrderDetails_order,
  {
    shipmentCosts,
    unfulfiledItemsQuantities,
    fulfiledItemsQuantities
  }: OrderReturnFormData
) =>
  getProductsAmountValues(
    order,
    fulfiledItemsQuantities,
    unfulfiledItemsQuantities,
    shipmentCosts
  );

export const getRefundProductsAmountValues = (
  order: OrderRefundData_order,
  {
    refundedFulfilledProductQuantities,
    refundShipmentCosts,
    refundedProductQuantities
  }: OrderRefundFormData
) =>
  getProductsAmountValues(
    order,
    refundedFulfilledProductQuantities,
    refundedProductQuantities,
    refundShipmentCosts
  );
