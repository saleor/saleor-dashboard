import { type ProductVariantStocksUpdateInput } from "@dashboard/graphql";

export type BulkPublishVariantStockSource = {
  stocks?: Array<{
    id: string;
    warehouse: { id: string };
  }> | null;
};

/**
 * Splits target warehouse quantities into create vs update for productVariantBulkUpdate.
 * Missing Stock rows are created; existing ones are updated by stock id.
 */
export const buildBulkPublishVariantStocksInput = ({
  variant,
  warehouseIds,
  quantity,
}: {
  variant: BulkPublishVariantStockSource;
  warehouseIds: string[];
  quantity: number;
}): ProductVariantStocksUpdateInput | undefined => {
  if (warehouseIds.length === 0 || !Number.isFinite(quantity)) {
    return undefined;
  }

  const create: NonNullable<ProductVariantStocksUpdateInput["create"]> = [];
  const update: NonNullable<ProductVariantStocksUpdateInput["update"]> = [];
  const stocksByWarehouseId = new Map(
    (variant.stocks ?? []).map(stock => [stock.warehouse.id, stock.id]),
  );

  for (const warehouseId of warehouseIds) {
    const stockId = stocksByWarehouseId.get(warehouseId);

    if (stockId) {
      update.push({
        stock: stockId,
        quantity,
      });
    } else {
      create.push({
        warehouse: warehouseId,
        quantity,
      });
    }
  }

  if (create.length === 0 && update.length === 0) {
    return undefined;
  }

  return {
    ...(create.length > 0 ? { create } : {}),
    ...(update.length > 0 ? { update } : {}),
  };
};
