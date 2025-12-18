import { numberCellEmptyValue } from "@dashboard/components/Datagrid/customCells/NumberCell";
import { DatagridChange } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { ProductFragment, ProductVariantStocksUpdateInput } from "@dashboard/graphql";
import { getColumnStock, isCurrentRow } from "@dashboard/products/utils/datagrid";

export function getStockData(data: DatagridChange[], currentIndex: number) {
  return data
    .filter(change => byHavingStockColumn(change, currentIndex))
    .map(toStockData)
    .filter(byStockWithQuantity);
}

export function getVaraintUpdateStockData(
  data: DatagridChange[],
  currentIndex: number,
  variant: NonNullable<ProductFragment["variants"]>[number],
) {
  return data
    .filter(change => byHavingStockColumn(change, currentIndex))
    .map(toStockData)
    .reduce<ProductVariantStocksUpdateInput>(toUpdateStockData(variant), {
      create: [],
      update: [],
      remove: [],
    });
}

function toUpdateStockData(variant: NonNullable<ProductFragment["variants"]>[number]) {
  return (acc: ProductVariantStocksUpdateInput, stock: ReturnType<typeof toStockData>) => {
    const variantStock = variant.stocks?.find(
      (variantStock: { warehouse: { id: string } }) =>
        variantStock.warehouse.id === stock.warehouse,
    );

    if (stock.quantity === numberCellEmptyValue) {
      if (variantStock) {
        acc.remove?.push(variantStock.id);
      }

      return acc;
    }

    if (variantStock) {
      acc.update?.push({
        quantity: stock.quantity as number,
        stock: variantStock.id,
      });
    } else {
      if (stock.warehouse) {
        acc.create?.push(stock as { warehouse: string; quantity: number });
      }
    }

    return acc;
  };
}

function toStockData(change: DatagridChange) {
  return {
    warehouse: getColumnStock(change.column),
    quantity: change.data.value,
  };
}

function byStockWithQuantity(stock: { quantity: unknown }) {
  return stock.quantity !== numberCellEmptyValue;
}

function byHavingStockColumn(change: DatagridChange, currentIndex: number) {
  return getColumnStock(change.column) && isCurrentRow(change.row, currentIndex);
}
