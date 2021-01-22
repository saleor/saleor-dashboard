import { IMoney, subtractMoney } from "@saleor/components/Money";
import { FormsetData } from "@saleor/hooks/useFormset";

import {
  LineItemData,
  OrderReturnFormData
} from "../components/OrderReturnPage/form";
import {
  getAllOrderFulfilledLines,
  getById
} from "../components/OrderReturnPage/utils";
import {
  OrderDetails_order,
  OrderDetails_order_fulfillments_lines,
  OrderDetails_order_lines
} from "../types/OrderDetails";
import {
  OrderRefundData_order,
  OrderRefundData_order_fulfillments,
  OrderRefundData_order_lines
} from "../types/OrderRefundData";

export type OrderWithTotalAndTotalCaptured = Pick<
  OrderRefundData_order,
  "total" | "totalCaptured"
>;

export function getPreviouslyRefundedPrice(
  order: OrderWithTotalAndTotalCaptured
): IMoney {
  return (
    order?.totalCaptured &&
    order?.total?.gross &&
    subtractMoney(order?.totalCaptured, order?.total?.gross)
  );
}

const getItemPriceAndQuantity = ({
  orderLines,
  itemsQuantities,
  id
}: {
  orderLines: OrderDetails_order_lines[];
  itemsQuantities: FormsetData<LineItemData, number>;
  id: string;
}) => {
  const { unitPrice } = orderLines.find(getById(id));
  const selectedQuantity = itemsQuantities.find(getById(id))?.value;

  return { selectedQuantity, unitPrice };
};

const selectItemPriceAndQuantity = (
  order: OrderDetails_order,
  {
    fulfilledItemsQuantities,
    unfulfilledItemsQuantities
  }: Partial<OrderReturnFormData>,
  id: string,
  isFulfillment: boolean
) =>
  isFulfillment
    ? getItemPriceAndQuantity({
        id,
        itemsQuantities: fulfilledItemsQuantities,
        orderLines: getAllOrderFulfilledLines(order)
      })
    : getItemPriceAndQuantity({
        id,
        itemsQuantities: unfulfilledItemsQuantities,
        orderLines: order.lines
      });

export const getReplacedProductsAmount = (
  order: OrderDetails_order,
  {
    itemsToBeReplaced,
    unfulfilledItemsQuantities,
    fulfilledItemsQuantities
  }: Partial<OrderReturnFormData>
) => {
  if (!order || !itemsToBeReplaced.length) {
    return 0;
  }

  return itemsToBeReplaced.reduce(
    (
      resultAmount: number,
      { id, value: isItemToBeReplaced, data: { isFulfillment, isRefunded } }
    ) => {
      if (!isItemToBeReplaced || isRefunded) {
        return resultAmount;
      }

      const { unitPrice, selectedQuantity } = selectItemPriceAndQuantity(
        order,
        { fulfilledItemsQuantities, unfulfilledItemsQuantities },
        id,
        isFulfillment
      );

      return resultAmount + unitPrice?.gross?.amount * selectedQuantity;
    },
    0
  );
};

export const getReturnSelectedProductsAmount = (
  order: OrderDetails_order,
  { itemsToBeReplaced, unfulfilledItemsQuantities, fulfilledItemsQuantities }
) => {
  if (!order) {
    return 0;
  }

  const unfulfilledItemsValue = getPartialProductsValue({
    itemsQuantities: unfulfilledItemsQuantities,
    itemsToBeReplaced,
    orderLines: order.lines
  });

  const fulfiledItemsValue = getPartialProductsValue({
    itemsQuantities: fulfilledItemsQuantities,
    itemsToBeReplaced,
    orderLines: getAllOrderFulfilledLines(order)
  });

  return unfulfilledItemsValue + fulfiledItemsValue;
};

const getPartialProductsValue = ({
  orderLines,
  itemsQuantities,
  itemsToBeReplaced
}: {
  itemsToBeReplaced: FormsetData<LineItemData, boolean>;
  itemsQuantities: FormsetData<LineItemData, number>;
  orderLines: OrderDetails_order_lines[];
}) =>
  itemsQuantities.reduce(
    (resultAmount, { id, value: quantity, data: { isRefunded } }) => {
      const { value: isItemToBeReplaced } = itemsToBeReplaced.find(getById(id));

      if (quantity < 1 || isItemToBeReplaced || isRefunded) {
        return resultAmount;
      }

      const { selectedQuantity, unitPrice } = getItemPriceAndQuantity({
        id,
        itemsQuantities,
        orderLines
      });

      return resultAmount + unitPrice.gross.amount * selectedQuantity;
    },
    0
  );

export function getRefundedLinesPriceSum(
  lines: OrderRefundData_order_lines[],
  refundedProductQuantities: FormsetData<null, string | number>
): number {
  return lines?.reduce((sum, line) => {
    const refundedLine = refundedProductQuantities.find(
      refundedLine => refundedLine.id === line.id
    );
    return sum + line.unitPrice.gross.amount * Number(refundedLine?.value || 0);
  }, 0);
}

export function getAllFulfillmentLinesPriceSum(
  fulfillments: OrderRefundData_order_fulfillments[],
  refundedFulfilledProductQuantities: FormsetData<null, string | number>
): number {
  return fulfillments?.reduce((sum, fulfillment) => {
    const fulfilmentLinesSum = fulfillment?.lines.reduce((sum, line) => {
      const refundedLine = refundedFulfilledProductQuantities.find(
        refundedLine => refundedLine.id === line.id
      );
      return (
        sum +
        line.orderLine.unitPrice.gross.amount * Number(refundedLine?.value || 0)
      );
    }, 0);
    return sum + fulfilmentLinesSum;
  }, 0);
}

export function mergeRepeatedOrderLines(
  fulfillmentLines: OrderDetails_order_fulfillments_lines[]
) {
  return fulfillmentLines.reduce((prev, curr) => {
    const existingOrderLineIndex = prev.findIndex(
      prevLine => prevLine.orderLine.id === curr.orderLine.id
    );

    if (existingOrderLineIndex === -1) {
      prev.push(curr);
    } else {
      const existingOrderLine = prev[existingOrderLineIndex];

      prev[existingOrderLineIndex] = {
        ...existingOrderLine,
        quantity: existingOrderLine.quantity + curr.quantity
      };
    }

    return prev;
  }, Array<OrderDetails_order_fulfillments_lines>());
}
