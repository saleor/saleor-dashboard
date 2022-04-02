import {
  OrderFulfillLineFragment,
  OrderFulfillStockInput
} from "@saleor/graphql";
import { FormsetData } from "@saleor/hooks/useFormset";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";

import { Warehouse } from "../OrderChangeWarehouseDialog/types";

export const getAllocatedQuantityForLine = (
  line: OrderFulfillLineFragment,
  warehouse: Warehouse
) => {
  const warehouseAllocation = line.allocations.find(
    allocation => allocation.warehouse.id === warehouse.id
  );
  return warehouseAllocation?.quantity || 0;
};

export const getOrderLineAvailableQuantity = (
  line: OrderFulfillLineFragment,
  stock: OrderFulfillLineFragment["variant"]["stocks"][0]
) => {
  if (!stock) {
    return 0;
  }

  const allocatedQuantityForLine = getAllocatedQuantityForLine(
    line,
    stock.warehouse
  );

  const availableQuantity =
    stock.quantity - stock.quantityAllocated + allocatedQuantityForLine;

  return availableQuantity;
};

export const getFulfillmentFormsetQuantity = (
  formsetData: FormsetData<null, OrderFulfillStockInput[]>,
  line: OrderFulfillLineFragment
) => formsetData.find(getById(line.id))?.value?.[0]?.quantity;
