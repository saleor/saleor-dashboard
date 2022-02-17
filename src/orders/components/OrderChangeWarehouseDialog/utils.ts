import { OrderDetails_order_lines } from "@saleor/orders/types/OrderDetails";

import { Warehouse } from "./types";

export const isLineAvailableInWarehouse = (
  line: OrderDetails_order_lines,
  warehouse: Warehouse
) => {
  if (line.variant.stocks.find(stock => stock.warehouse.id === warehouse.id)) {
    return line.quantityToFulfill <= getAvailableQuantity(line, warehouse);
  }
  return false;
};
export const getAvailableQuantity = (
  line: OrderDetails_order_lines,
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
