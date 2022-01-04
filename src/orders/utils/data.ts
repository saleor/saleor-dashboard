import { IMoney, subtractMoney } from "@saleor/components/Money";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { FormsetData } from "@saleor/hooks/useFormset";
import { addressToAddressInput } from "@saleor/misc";
import {
  AddressInput,
  CountryCode,
  FulfillmentStatus,
  OrderErrorCode
} from "@saleor/types/globalTypes";

import {
  LineItemData,
  OrderReturnFormData
} from "../components/OrderReturnPage/form";
import {
  getAllOrderFulfilledLines,
  getAllOrderWaitingLines,
  getById
} from "../components/OrderReturnPage/utils";
import { FulfillOrder_orderFulfill_errors } from "../types/FulfillOrder";
import {
  OrderDetails_order,
  OrderDetails_order_fulfillments_lines,
  OrderDetails_order_lines
} from "../types/OrderDetails";
import { OrderFulfillData_order_lines } from "../types/OrderFulfillData";
import {
  OrderRefundData_order,
  OrderRefundData_order_fulfillments,
  OrderRefundData_order_lines
} from "../types/OrderRefundData";

export type OrderWithTotalAndTotalCaptured = Pick<
  OrderRefundData_order,
  "total" | "totalCaptured"
>;

export interface OrderLineWithStockWarehouses {
  variant?: {
    stocks: Array<{ warehouse: WarehouseFragment }>;
  };
}

export function getToFulfillOrderLines(lines?: OrderFulfillData_order_lines[]) {
  return lines?.filter(line => line.quantityToFulfill > 0) || [];
}

export function getWarehousesFromOrderLines<
  T extends OrderLineWithStockWarehouses
>(lines?: T[]) {
  return lines?.reduce(
    (warehouses, line) =>
      line.variant?.stocks?.reduce(
        (warehouses, stock) =>
          warehouses.some(getById(stock.warehouse.id))
            ? warehouses
            : [...warehouses, stock.warehouse],
        warehouses
      ),
    [] as WarehouseFragment[]
  );
}

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

const getFulfillmentByFulfillmentLineId = (order, fulfillmentLineId) => {
  for (const fulfillment of order.fulfillments) {
    if (fulfillment.lines.find(getById(fulfillmentLineId))) {
      return fulfillment;
    }
  }
};

const selectItemPriceAndQuantity = (
  order: OrderDetails_order,
  {
    fulfilledItemsQuantities,
    waitingItemsQuantities,
    unfulfilledItemsQuantities
  }: Partial<OrderReturnFormData>,
  id: string,
  isFulfillment: boolean
) => {
  const fulfillment = getFulfillmentByFulfillmentLineId(order, id);
  if (fulfillment?.status === FulfillmentStatus.WAITING_FOR_APPROVAL) {
    return getItemPriceAndQuantity({
      id,
      itemsQuantities: waitingItemsQuantities,
      orderLines: getAllOrderWaitingLines(order)
    });
  }
  return isFulfillment
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
};

export const getReplacedProductsAmount = (
  order: OrderDetails_order,
  {
    itemsToBeReplaced,
    unfulfilledItemsQuantities,
    waitingItemsQuantities,
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
        {
          fulfilledItemsQuantities,
          waitingItemsQuantities,
          unfulfilledItemsQuantities
        },
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
  {
    itemsToBeReplaced,
    waitingItemsQuantities,
    unfulfilledItemsQuantities,
    fulfilledItemsQuantities
  }
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

  const waitingItemsValue = getPartialProductsValue({
    itemsQuantities: waitingItemsQuantities,
    itemsToBeReplaced,
    orderLines: getAllOrderWaitingLines(order)
  });

  return unfulfilledItemsValue + fulfiledItemsValue + waitingItemsValue;
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

export const isStockError = (
  overfulfill: boolean,
  formsetStock: { quantity: number },
  availableQuantity: number,
  warehouse: WarehouseFragment,
  line: OrderFulfillData_order_lines,
  errors: FulfillOrder_orderFulfill_errors[]
) => {
  if (overfulfill) {
    return true;
  }

  const isQuantityLargerThanAvailable =
    line.variant.trackInventory && formsetStock.quantity > availableQuantity;

  const isError = !!errors?.find(
    err =>
      err.warehouse === warehouse.id &&
      err.orderLines.find((id: string) => id === line.id) &&
      err.code === OrderErrorCode.INSUFFICIENT_STOCK
  );

  return isQuantityLargerThanAvailable || isError;
};

export const getVariantSearchAddress = (
  order: OrderDetails_order
): AddressInput => {
  if (order.shippingAddress) {
    return addressToAddressInput(order.shippingAddress);
  }

  if (order.billingAddress) {
    return addressToAddressInput(order.billingAddress);
  }

  return { country: order.channel.defaultCountry.code as CountryCode };
};
