import { FormsetData } from "@saleor/hooks/useFormset";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import {
  OrderFulfillData_order_lines,
  OrderFulfillData_order_lines_variant_stocks,
  OrderFulfillData_order_lines_variant_stocks_warehouse
} from "@saleor/orders/types/OrderFulfillData";
import { OrderFulfillStockInput } from "@saleor/types/globalTypes";

export const getAllocatedQuantityForLine = (
  line: OrderFulfillData_order_lines,
  warehouse: OrderFulfillData_order_lines_variant_stocks_warehouse
) => {
  const warehouseAllocation = line.allocations.find(
    allocation => allocation.warehouse.id === warehouse.id
  );
  return warehouseAllocation?.quantity || 0;
};

export const getOrderLineAvailableQuantity = (
  line: OrderFulfillData_order_lines,
  stock: OrderFulfillData_order_lines_variant_stocks
) => {
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
  line: OrderFulfillData_order_lines,
  stock: OrderFulfillData_order_lines_variant_stocks
) =>
  formsetData
    .find(getById(line.id))
    ?.value.find(val => val.warehouse === stock.warehouse.id).quantity;
