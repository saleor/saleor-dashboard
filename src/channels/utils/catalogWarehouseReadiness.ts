export type CatalogWarehouseReadiness = "no_shop_warehouses" | "no_channel_warehouses" | "ready";

export const getCatalogWarehouseReadiness = ({
  channelWarehouseCount,
  shopWarehouseCount,
}: {
  channelWarehouseCount: number;
  shopWarehouseCount: number;
}): CatalogWarehouseReadiness => {
  if (channelWarehouseCount > 0) {
    return "ready";
  }

  if (shopWarehouseCount === 0) {
    return "no_shop_warehouses";
  }

  return "no_channel_warehouses";
};
