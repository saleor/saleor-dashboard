import { IMoney, subtractMoney } from "@saleor/components/Money";
import {
  AddressFragment,
  AddressInput,
  CountryCode,
  FulfillmentFragment,
  FulfillmentStatus,
  OrderDetailsFragment,
  OrderFulfillLineFragment,
  OrderLineFragment,
  OrderLineStockDataFragment,
  OrderRefundDataQuery,
  StockFragment,
  WarehouseFragment,
} from "@saleor/graphql";
import { FormsetData } from "@saleor/hooks/useFormset";
import { findInEnum } from "@saleor/misc";

import {
  LineItemData,
  OrderReturnFormData,
} from "../components/OrderReturnPage/form";
import {
  getAllOrderFulfilledLines,
  getAllOrderWaitingLines,
  getById,
} from "../components/OrderReturnPage/utils";

export type OrderWithTotalAndTotalCaptured = Pick<
  OrderRefundDataQuery["order"],
  "total" | "totalCaptured"
>;

export interface OrderLineWithStockWarehouses {
  variant?: {
    stocks: Array<{ warehouse: WarehouseFragment }>;
  };
}

export function getToFulfillOrderLines(lines?: OrderLineStockDataFragment[]) {
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
        warehouses,
      ),
    [] as WarehouseFragment[],
  );
}

export function getPreviouslyRefundedPrice(
  order: OrderWithTotalAndTotalCaptured,
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
  id,
}: {
  orderLines: OrderLineFragment[];
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
  order: OrderDetailsFragment,
  {
    fulfilledItemsQuantities,
    waitingItemsQuantities,
    unfulfilledItemsQuantities,
  }: Partial<OrderReturnFormData>,
  id: string,
  isFulfillment: boolean,
) => {
  const fulfillment = getFulfillmentByFulfillmentLineId(order, id);
  if (fulfillment?.status === FulfillmentStatus.WAITING_FOR_APPROVAL) {
    return getItemPriceAndQuantity({
      id,
      itemsQuantities: waitingItemsQuantities,
      orderLines: getAllOrderWaitingLines(order),
    });
  }
  return isFulfillment
    ? getItemPriceAndQuantity({
        id,
        itemsQuantities: fulfilledItemsQuantities,
        orderLines: getAllOrderFulfilledLines(order),
      })
    : getItemPriceAndQuantity({
        id,
        itemsQuantities: unfulfilledItemsQuantities,
        orderLines: order.lines,
      });
};

export const getReplacedProductsAmount = (
  order: OrderDetailsFragment,
  {
    itemsToBeReplaced,
    unfulfilledItemsQuantities,
    waitingItemsQuantities,
    fulfilledItemsQuantities,
  }: Partial<OrderReturnFormData>,
) => {
  if (!order || !itemsToBeReplaced.length) {
    return 0;
  }

  return itemsToBeReplaced.reduce(
    (
      resultAmount: number,
      { id, value: isItemToBeReplaced, data: { isFulfillment, isRefunded } },
    ) => {
      if (!isItemToBeReplaced || isRefunded) {
        return resultAmount;
      }

      const { unitPrice, selectedQuantity } = selectItemPriceAndQuantity(
        order,
        {
          fulfilledItemsQuantities,
          waitingItemsQuantities,
          unfulfilledItemsQuantities,
        },
        id,
        isFulfillment,
      );

      return resultAmount + unitPrice?.gross?.amount * selectedQuantity;
    },
    0,
  );
};

export const getReturnSelectedProductsAmount = (
  order: OrderDetailsFragment,
  {
    itemsToBeReplaced,
    waitingItemsQuantities,
    unfulfilledItemsQuantities,
    fulfilledItemsQuantities,
  },
) => {
  if (!order) {
    return 0;
  }

  const unfulfilledItemsValue = getPartialProductsValue({
    itemsQuantities: unfulfilledItemsQuantities,
    itemsToBeReplaced,
    orderLines: order.lines,
  });

  const fulfiledItemsValue = getPartialProductsValue({
    itemsQuantities: fulfilledItemsQuantities,
    itemsToBeReplaced,
    orderLines: getAllOrderFulfilledLines(order),
  });

  const waitingItemsValue = getPartialProductsValue({
    itemsQuantities: waitingItemsQuantities,
    itemsToBeReplaced,
    orderLines: getAllOrderWaitingLines(order),
  });

  return unfulfilledItemsValue + fulfiledItemsValue + waitingItemsValue;
};

const getPartialProductsValue = ({
  orderLines,
  itemsQuantities,
  itemsToBeReplaced,
}: {
  itemsToBeReplaced: FormsetData<LineItemData, boolean>;
  itemsQuantities: FormsetData<LineItemData, number>;
  orderLines: OrderLineFragment[];
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
        orderLines,
      });

      return resultAmount + unitPrice.gross.amount * selectedQuantity;
    },
    0,
  );

export function getRefundedLinesPriceSum(
  lines: OrderRefundDataQuery["order"]["lines"],
  refundedProductQuantities: FormsetData<null, string | number>,
): number {
  return lines?.reduce((sum, line) => {
    const refundedLine = refundedProductQuantities.find(
      refundedLine => refundedLine.id === line.id,
    );
    return sum + line.unitPrice.gross.amount * Number(refundedLine?.value || 0);
  }, 0);
}

export function getAllFulfillmentLinesPriceSum(
  fulfillments: OrderRefundDataQuery["order"]["fulfillments"],
  refundedFulfilledProductQuantities: FormsetData<null, string | number>,
): number {
  return fulfillments?.reduce((sum, fulfillment) => {
    const fulfilmentLinesSum = fulfillment?.lines.reduce((sum, line) => {
      const refundedLine = refundedFulfilledProductQuantities.find(
        refundedLine => refundedLine.id === line.id,
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
  fulfillmentLines: OrderDetailsFragment["fulfillments"][0]["lines"],
) {
  return fulfillmentLines.reduce((prev, curr) => {
    const existingOrderLineIndex = prev.findIndex(
      prevLine => prevLine.orderLine.id === curr.orderLine.id,
    );

    if (existingOrderLineIndex === -1) {
      prev.push(curr);
    } else {
      const existingOrderLine = prev[existingOrderLineIndex];

      prev[existingOrderLineIndex] = {
        ...existingOrderLine,
        quantity: existingOrderLine.quantity + curr.quantity,
      };
    }

    return prev;
  }, Array<OrderDetailsFragment["fulfillments"][0]["lines"][0]>());
}

export function addressToAddressInput<T>(
  address: T & AddressFragment,
): AddressInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, __typename, ...rest } = address;
  return {
    ...rest,
    country: findInEnum(address.country.code, CountryCode),
  };
}

export const getVariantSearchAddress = (
  order: OrderDetailsFragment,
): AddressInput => {
  if (order.shippingAddress) {
    return addressToAddressInput(order.shippingAddress);
  }

  if (order.billingAddress) {
    return addressToAddressInput(order.billingAddress);
  }

  return { country: order.channel.defaultCountry.code as CountryCode };
};

export const getAllocatedQuantityForLine = (
  line: OrderLineStockDataFragment,
  warehouseId: string,
) => {
  const warehouseAllocation = line.allocations.find(
    allocation => allocation.warehouse.id === warehouseId,
  );
  return warehouseAllocation?.quantity || 0;
};

export const getOrderLineAvailableQuantity = (
  line: OrderLineStockDataFragment,
  stock: StockFragment,
) => {
  if (!stock) {
    return 0;
  }
  const allocatedQuantityForLine = getAllocatedQuantityForLine(
    line,
    stock.warehouse.id,
  );

  const availableQuantity =
    stock.quantity - stock.quantityAllocated + allocatedQuantityForLine;

  return availableQuantity;
};

export interface OrderFulfillLineFormData {
  quantity: number;
  warehouse: WarehouseFragment;
}

export type OrderFulfillStockFormsetData = Array<
  Pick<FormsetData<null, OrderFulfillLineFormData[]>[0], "id" | "value">
>;

export const getFulfillmentFormsetQuantity = (
  formsetData: OrderFulfillStockFormsetData,
  line: OrderLineStockDataFragment,
) => formsetData?.find(getById(line.id))?.value?.[0]?.quantity;

export const getWarehouseStock = (
  stocks: StockFragment[],
  warehouseId: string,
) => stocks?.find(stock => stock.warehouse.id === warehouseId);

export const isLineAvailableInWarehouse = (
  line: OrderFulfillLineFragment | OrderLineStockDataFragment,
  warehouse: WarehouseFragment,
): boolean => {
  if (!line?.variant?.stocks) {
    return false;
  }
  const stock = getWarehouseStock(line.variant.stocks, warehouse.id);
  if (stock) {
    return line.quantityToFulfill <= getOrderLineAvailableQuantity(line, stock);
  }
  return false;
};

export const getLineAvailableQuantityInWarehouse = (
  line: OrderFulfillLineFragment,
  warehouse: WarehouseFragment,
): number => {
  if (!line?.variant?.stocks) {
    return 0;
  }
  const stock = getWarehouseStock(line.variant.stocks, warehouse.id);
  if (stock) {
    return getOrderLineAvailableQuantity(line, stock);
  }
  return 0;
};

export const getLineAllocationWithHighestQuantity = (
  line: OrderFulfillLineFragment,
): OrderFulfillLineFragment["allocations"][number] | undefined =>
  line.allocations.reduce((prevAllocation, allocation) => {
    if (!prevAllocation || prevAllocation.quantity < allocation.quantity) {
      return allocation;
    }
    return prevAllocation;
  }, null);

export const getWarehouseWithHighestAvailableQuantity = (
  lines?: OrderLineFragment[],
): WarehouseFragment | undefined => {
  let highestAvailableQuantity = 0;

  return lines?.reduce(
    (selectedWarehouse, line) =>
      line.allocations.reduce((warehouse, allocation) => {
        if (allocation.quantity > highestAvailableQuantity) {
          highestAvailableQuantity = allocation.quantity;
          return allocation.warehouse;
        }
        return warehouse;
      }, selectedWarehouse),
    null as WarehouseFragment,
  );
};

export const transformFuflillmentLinesToStockFormsetData = (
  lines: FulfillmentFragment["lines"],
  warehouse: WarehouseFragment,
): OrderFulfillStockFormsetData =>
  lines?.map(line => ({
    data: null,
    id: line.orderLine.id,
    value: [
      {
        quantity: line.quantity,
        warehouse,
      },
    ],
  }));

export const getAttributesCaption = (
  attributes: OrderFulfillLineFragment["variant"]["attributes"] | undefined,
): string | undefined =>
  attributes
    ?.map(attribute =>
      attribute.values.map(attributeValue => attributeValue.name).join(", "),
    )
    .join(" / ");
