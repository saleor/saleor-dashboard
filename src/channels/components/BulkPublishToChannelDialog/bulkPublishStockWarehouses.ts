import { type BulkPublishStockSettings, type BulkPublishWarehouse } from "./types";

export const BULK_PUBLISH_STOCK_ALL_WAREHOUSES = "all_channel" as const;

export const getBulkPublishStockWarehouses = ({
  channelWarehouses,
  stock,
}: {
  channelWarehouses: BulkPublishWarehouse[];
  stock: BulkPublishStockSettings;
}): BulkPublishWarehouse[] => {
  if (!stock.enabled || channelWarehouses.length === 0) {
    return [];
  }

  if (stock.warehouseScope === "single") {
    const selectedWarehouse = channelWarehouses.find(
      warehouse => warehouse.id === stock.warehouseId,
    );

    return selectedWarehouse ? [selectedWarehouse] : [];
  }

  return channelWarehouses;
};

export const getBulkPublishStockWarehouseSelectValue = (
  stock: BulkPublishStockSettings,
): string => {
  if (stock.warehouseScope === "single" && stock.warehouseId) {
    return stock.warehouseId;
  }

  return BULK_PUBLISH_STOCK_ALL_WAREHOUSES;
};

export const isValidBulkPublishStockWarehouseSelection = ({
  channelWarehouses,
  stock,
}: {
  channelWarehouses: BulkPublishWarehouse[];
  stock: BulkPublishStockSettings;
}): boolean => {
  if (!stock.enabled || channelWarehouses.length <= 1) {
    return true;
  }

  if (stock.warehouseScope === "all_channel") {
    return true;
  }

  return channelWarehouses.some(warehouse => warehouse.id === stock.warehouseId);
};

export const getBulkPublishStockWarehouseName = ({
  channelWarehouses,
  stock,
}: {
  channelWarehouses: BulkPublishWarehouse[];
  stock: BulkPublishStockSettings;
}): string | undefined => {
  const warehouses = getBulkPublishStockWarehouses({ channelWarehouses, stock });

  return warehouses.length === 1 ? warehouses[0]?.name : undefined;
};
