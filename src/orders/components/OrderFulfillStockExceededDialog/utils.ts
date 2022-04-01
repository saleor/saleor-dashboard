import { OrderFulfillDataQuery, OrderFulfillStockInput } from "@saleor/graphql";
import { FormsetData } from "@saleor/hooks/useFormset";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";

export const getAllocatedQuantityForLine = (
  line: OrderFulfillDataQuery["order"]["lines"][0],
  warehouse: OrderFulfillDataQuery["order"]["lines"][0]["variant"]["stocks"][0]["warehouse"]
) => {
  const warehouseAllocation = line.allocations.find(
    allocation => allocation.warehouse.id === warehouse.id
  );
  return warehouseAllocation?.quantity || 0;
};

export const getOrderLineAvailableQuantity = (
  line: OrderFulfillDataQuery["order"]["lines"][0],
  stock: OrderFulfillDataQuery["order"]["lines"][0]["variant"]["stocks"][0]
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
  line: OrderFulfillDataQuery["order"]["lines"][0],
  stock: OrderFulfillDataQuery["order"]["lines"][0]["variant"]["stocks"][0]
) =>
  formsetData
    .find(getById(line.id))
    ?.value.find(val => val.warehouse === stock.warehouse.id).quantity;
