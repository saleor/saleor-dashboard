import { OrderFulfillDataQuery } from "@saleor/graphql";

export const getDefaultFulfillmentValue = (
  line: OrderFulfillDataQuery["order"]["lines"][0],
  warehouseId: string
) => {
  const isDeletedVariant = !line?.variant;
  const isPreorder = line?.variant?.preorder;
  const noStock = !line?.variant?.stocks?.some(
    stock => stock.warehouse.id === warehouseId
  );

  if (isPreorder) {
    return null;
  }

  if (isDeletedVariant || noStock) {
    return [
      {
        quantity: 0,
        warehouse: warehouseId
      }
    ];
  }

  return line.variant?.stocks
    ?.filter(stock => stock.warehouse.id === warehouseId)
    .map(stock => ({
      quantity: line.quantityToFulfill,
      warehouse: stock.warehouse.id
    }));
};
