import { OrderDetails_order_lines } from "@saleor/orders/types/OrderDetails";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";

export const isLineAvailableInWarehouse = (
  line: OrderDetails_order_lines,
  warehouse: SearchWarehouses_search_edges_node
) => {
  if (line.variant.stocks.find(stock => stock.warehouse.id === warehouse.id)) {
    return line.quantityToFulfill <= getAvailableQuantity(line, warehouse);
  }
  return false;
};
export const getAvailableQuantity = (
  line: OrderDetails_order_lines,
  warehouse: SearchWarehouses_search_edges_node
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
