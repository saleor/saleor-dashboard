import { type BulkPublishWarehouse } from "./types";

export type BulkPublishStockScope =
  | { kind: "no_shop_warehouses" }
  | { kind: "no_channel_warehouses" }
  | { kind: "channel_warehouses"; warehouses: BulkPublishWarehouse[] };

export const getBulkPublishStockScope = ({
  channelWarehouses,
  shopWarehouseCount,
}: {
  channelWarehouses: BulkPublishWarehouse[];
  shopWarehouseCount: number;
}): BulkPublishStockScope => {
  if (shopWarehouseCount === 0) {
    return { kind: "no_shop_warehouses" };
  }

  if (channelWarehouses.length > 0) {
    return { kind: "channel_warehouses", warehouses: channelWarehouses };
  }

  return { kind: "no_channel_warehouses" };
};

export const canSetBulkPublishStock = (scope: BulkPublishStockScope): boolean =>
  scope.kind === "channel_warehouses";
