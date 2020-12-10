import { FormsetData } from "@saleor/hooks/useFormset";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import {
  getAllFulfillmentLinesPriceSum,
  getPreviouslyRefundedPrice,
  getRefundedLinesPriceSum,
  getReplacedProductsAmount,
  getReturnSelectedProductsAmount
} from "@saleor/orders/utils/data";

import { OrderRefundFormData } from "../OrderRefundPage/form";
import { LineItemData, OrderReturnFormData } from "../OrderReturnPage/form";
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
  fulfilledItemsQuantities: FormsetData<null | LineItemData, string | number>,
  unfulfilledItemsQuantities: FormsetData<null | LineItemData, string | number>,
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
    unfulfilledItemsQuantities as FormsetData<null, string>
  );
  const allFulfillmentLinesSum = getAllFulfillmentLinesPriceSum(
    order?.fulfillments,
    fulfilledItemsQuantities as FormsetData<null, string>
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
  formData: OrderReturnFormData
) => {
  const authorizedAmount = order?.total?.gross;

  const replacedProductsValue = authorizedAmount?.currency && {
    amount: getReplacedProductsAmount(order, formData),
    currency: authorizedAmount.currency
  };

  const selectedProductsValue = authorizedAmount?.currency && {
    amount: getReturnSelectedProductsAmount(order, formData),
    currency: authorizedAmount.currency
  };

  const {
    fulfiledItemsQuantities,
    unfulfiledItemsQuantities,
    refundShipmentCosts
  } = formData;

  return {
    ...getProductsAmountValues(
      order,
      fulfiledItemsQuantities,
      unfulfiledItemsQuantities,
      refundShipmentCosts
    ),
    replacedProductsValue,
    selectedProductsValue
  };
};

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
