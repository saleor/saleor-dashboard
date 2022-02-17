import { OrderLineFragment } from "@saleor/graphql";

import { Warehouse } from "./types";

export const isLineAvailableInWarehouse = (
  line: OrderLineFragment,
  warehouse: Warehouse
) => {
  if (line.variant.stocks.find(stock => stock.warehouse.id === warehouse.id)) {
    return line.quantityToFulfill <= getAvailableQuantity(line, warehouse);
  }
  return false;
};
export const getAvailableQuantity = (
  line: OrderLineFragment,
  warehouse: Warehouse
) => {
  const warehouseStock = line.variant?.stocks?.find(
    stock => stock.warehouse.id === warehouse.id
  );
  const warehouseAllocation = line.allocations.find(
    allocation => allocation.warehouse.id === warehouse.id
  );
  const allocatedQuantityForLine = warehouseAllocation?.quantity || 0;
  const availableQuantity =
    warehouseStock?.quantity -
    warehouseStock?.quantityAllocated +
    allocatedQuantityForLine;

  return availableQuantity;
};
