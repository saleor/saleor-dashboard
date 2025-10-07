import { subtractMoney } from "@dashboard/components/Money";
import {
  AddressFragment,
  AddressInput,
  CountryCode,
  FulfillmentFragment,
  FulfillmentStatus,
  OrderDetailsFragment,
  OrderDetailsQuery,
  OrderDiscountFragment,
  OrderDiscountType,
  OrderFulfillLineFragment,
  OrderLineFragment,
  OrderLineStockDataFragment,
  OrderRefundDataQuery,
  StockFragment,
  WarehouseFragment,
} from "@dashboard/graphql";
import { FormsetData } from "@dashboard/hooks/useFormset";
import { findInEnum, getById } from "@dashboard/misc";
import { IMoney } from "@dashboard/utils/intl";
import { IntlShape } from "react-intl";

import { LineItemData, OrderReturnFormData } from "../components/OrderReturnPage/form";
import {
  getAllOrderFulfilledLines,
  getAllOrderWaitingLines,
} from "../components/OrderReturnPage/utils";
import { orderDiscountTypeLabelMessages } from "../messages";
import { OrderRefundSharedType } from "../types";

export type OrderWithTotalAndTotalCaptured = Pick<
  NonNullable<OrderRefundDataQuery["order"]>,
  "total" | "totalCaptured"
>;

export interface OrderLineWithStockWarehouses {
  variant?: {
    stocks: Array<{ warehouse: WarehouseFragment }>;
  };
}

export function getOrderCharged(order: OrderDetailsFragment) {
  if (order?.totalCharged) {
    return order.totalCharged;
  }

  return order?.totalCaptured;
}

export function getToFulfillOrderLines(lines?: OrderLineStockDataFragment[]) {
  return lines?.filter(line => line.quantityToFulfill > 0) || [];
}

export function getWarehousesFromOrderLines<T extends OrderLineWithStockWarehouses>(lines?: T[]) {
  return lines?.reduce(
    (warehouses, line) =>
      line.variant?.stocks?.reduce(
        (warehouses, stock) =>
          warehouses.some(getById(stock.warehouse.id))
            ? warehouses
            : [...warehouses, stock.warehouse],
        warehouses,
      ) ?? warehouses,
    [] as WarehouseFragment[],
  );
}

export function getPreviouslyRefundedPrice(order: OrderRefundSharedType): IMoney {
  const orderDetails = order as OrderDetailsFragment;
  const charged = getOrderCharged(orderDetails);
  const total = orderDetails?.total?.gross;

  return charged && total ? subtractMoney(charged, total) : charged;
}

export const getItemPriceAndQuantity = ({
  orderLines,
  itemsQuantities,
  id,
}: {
  orderLines: Array<OrderLineFragment & { orderLineId?: string }>;
  itemsQuantities: FormsetData<LineItemData, number>;
  id: string;
}) => {
  if (orderLines.length === 0) {
    return {};
  }

  const selectedOrderLine = orderLines.find(getById(id));
  const selectedQuantity = itemsQuantities.find(getById(id))?.value;

  return { selectedQuantity, unitPrice: selectedOrderLine?.unitPrice };
};

const getFulfillmentByFulfillmentLineId = (
  order: OrderDetailsFragment,
  fulfillmentLineId: string,
) => {
  for (const fulfillment of order.fulfillments) {
    if (fulfillment.lines?.find(getById(fulfillmentLineId))) {
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
      itemsQuantities: waitingItemsQuantities ?? [],
      orderLines: getAllOrderWaitingLines(order),
    });
  }

  return isFulfillment
    ? getItemPriceAndQuantity({
        id,
        itemsQuantities: fulfilledItemsQuantities ?? [],
        orderLines: getAllOrderFulfilledLines(order),
      })
    : getItemPriceAndQuantity({
        id,
        itemsQuantities: unfulfilledItemsQuantities ?? [],
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
  if (!order || !itemsToBeReplaced?.length) {
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

      return resultAmount + (unitPrice?.gross?.amount ?? 0) * (selectedQuantity ?? 0);
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
  }: Partial<OrderReturnFormData>,
) => {
  if (!order) {
    return 0;
  }

  const unfulfilledItemsValue = getPartialProductsValue({
    itemsQuantities: unfulfilledItemsQuantities ?? [],
    itemsToBeReplaced: itemsToBeReplaced ?? [],
    orderLines: order.lines,
  });
  const fulfiledItemsValue = getPartialProductsValue({
    itemsQuantities: fulfilledItemsQuantities ?? [],
    itemsToBeReplaced: itemsToBeReplaced ?? [],
    orderLines: getAllOrderFulfilledLines(order),
  });
  const waitingItemsValue = getPartialProductsValue({
    itemsQuantities: waitingItemsQuantities ?? [],
    itemsToBeReplaced: itemsToBeReplaced ?? [],
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
}) => {
  return itemsQuantities.reduce((resultAmount, { id, value: quantity, data: { isRefunded } }) => {
    const { value: isItemToBeReplaced } = itemsToBeReplaced.find(getById(id)) ?? { value: false };

    if (quantity < 1 || isItemToBeReplaced || isRefunded) {
      return resultAmount;
    }

    const partialProductsValue = getItemPriceAndQuantity({
      id,
      itemsQuantities,
      orderLines,
    });

    return (
      resultAmount +
      (partialProductsValue?.unitPrice?.gross.amount ?? 0) *
        (partialProductsValue?.selectedQuantity ?? 0)
    );
  }, 0);
};

export function getRefundedLinesPriceSum(
  lines: NonNullable<OrderRefundDataQuery["order"]>["lines"],
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
  fulfillments: NonNullable<OrderRefundDataQuery["order"]>["fulfillments"],
  refundedFulfilledProductQuantities: FormsetData<null, string | number>,
): number {
  return fulfillments?.reduce((sum, fulfillment) => {
    const fulfilmentLinesSum = fulfillment?.lines?.reduce((sum, line) => {
      const refundedLine = refundedFulfilledProductQuantities.find(
        refundedLine => refundedLine.id === line.id,
      );

      return sum + (line.orderLine?.unitPrice.gross.amount ?? 0) * Number(refundedLine?.value || 0);
    }, 0);

    return sum + (fulfilmentLinesSum ?? 0);
  }, 0);
}

export function mergeRepeatedOrderLines(
  fulfillmentLines: OrderDetailsFragment["fulfillments"][0]["lines"],
) {
  return (
    fulfillmentLines?.reduce((prev, curr) => {
      const existingOrderLineIndex = prev.findIndex(
        prevLine => prevLine.orderLine?.id === curr.orderLine?.id,
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
    }, Array<NonNullable<OrderDetailsFragment["fulfillments"][0]["lines"]>[0]>()) ?? []
  );
}

function addressToAddressInput<T>(address: T & AddressFragment): AddressInput {
  const { __typename, id: _id, ...rest } = address;

  return {
    ...rest,
    country: findInEnum(address.country.code, CountryCode),
  };
}

export const getVariantSearchAddress = (order: OrderDetailsFragment): AddressInput => {
  if (order.shippingAddress) {
    return addressToAddressInput(order.shippingAddress);
  }

  if (order.billingAddress) {
    return addressToAddressInput(order.billingAddress);
  }

  return { country: order.channel.defaultCountry.code as CountryCode };
};

const getAllocatedQuantityForLine = (line: OrderLineStockDataFragment, warehouseId: string) => {
  const warehouseAllocation = line.allocations?.find(
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

  const allocatedQuantityForLine = getAllocatedQuantityForLine(line, stock.warehouse.id);
  const availableQuantity = stock.quantity - stock.quantityAllocated + allocatedQuantityForLine;

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

export const getWarehouseStock = (stocks: StockFragment[], warehouseId: string) =>
  stocks?.find(stock => stock.warehouse.id === warehouseId);

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
): NonNullable<OrderFulfillLineFragment["allocations"]>[number] | undefined | null =>
  line.allocations?.reduce(
    (prevAllocation, allocation) => {
      if (!prevAllocation || prevAllocation.quantity < allocation.quantity) {
        return allocation;
      }

      return prevAllocation;
    },
    null as NonNullable<OrderFulfillLineFragment["allocations"]>[number] | null,
  );

export const transformFuflillmentLinesToStockFormsetData = (
  lines: FulfillmentFragment["lines"],
  warehouse: WarehouseFragment,
): OrderFulfillStockFormsetData =>
  lines?.map(line => ({
    data: null,
    id: line.orderLine?.id ?? "",
    value: [
      {
        quantity: line.quantity,
        warehouse,
      },
    ],
  })) ?? [];

export const getAttributesCaption = (
  attributes: NonNullable<OrderFulfillLineFragment["variant"]>["attributes"] | undefined,
): string | undefined => {
  const separator = " / ";

  const names = attributes
    ?.map(attribute => attribute.values.map(attributeValue => attributeValue.name).join(", "))
    .filter(Boolean);

  if (!names || names.length === 0) {
    return "";
  }

  return `${separator}${names.join(separator)}`;
};

export const prepareMoney = (
  amount: number,
  currency: string,
): NonNullable<OrderDetailsQuery["order"]>["totalCaptured"] => ({
  __typename: "Money",
  amount,
  currency: currency ?? "USD",
});

export const isAnyAddressEditModalOpen = (uri: string | undefined): boolean =>
  uri
    ? ["edit-customer-addresses", "edit-shipping-address", "edit-billing-address"].includes(uri)
    : false;

const NAME_SEPARATOR = ":";
const getDiscountNameLabel = (name: string) => {
  if (name.includes(NAME_SEPARATOR)) {
    const [promotionName] = name.split(NAME_SEPARATOR);

    return promotionName.trim() || "-";
  }

  return name;
};

export const getDiscountTypeLabel = (discount: OrderDiscountFragment, intl: IntlShape) => {
  switch (discount.type) {
    case OrderDiscountType.MANUAL:
      return intl.formatMessage(orderDiscountTypeLabelMessages.staffAdded);
    case OrderDiscountType.ORDER_PROMOTION:
      return getDiscountNameLabel(discount.name ?? "");
    case OrderDiscountType.VOUCHER:
      return intl.formatMessage(orderDiscountTypeLabelMessages.voucher, {
        voucherName: discount.name,
      });

    case OrderDiscountType.PROMOTION:
      return intl.formatMessage(orderDiscountTypeLabelMessages.promotion);

    case OrderDiscountType.SALE:
      return intl.formatMessage(orderDiscountTypeLabelMessages.sale);
  }
};
