// @ts-strict-ignore
import {
  booleanCell,
  buttonCell,
  loadingCell,
  moneyCell,
  moneyDiscountedCell,
  readonlyTextCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { type GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type Locale } from "@dashboard/components/Locale";
import { type OrderLineFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getDatagridRowDataIndex, isFirstColumn } from "@dashboard/misc";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const orderDetailsStaticColumnsAdapter = (
  intl: IntlShape,
  emptyColumn: AvailableColumn,
): AvailableColumn[] => [
  emptyColumn,
  {
    id: "product",
    title: intl.formatMessage(columnsMessages.product),
    width: 300,
  },
  {
    id: "sku",
    title: intl.formatMessage(columnsMessages.sku),
    width: 150,
  },
  {
    id: "variantName",
    title: intl.formatMessage(columnsMessages.variantName),
    width: 150,
  },
  {
    id: "quantity",
    title: intl.formatMessage(columnsMessages.quantity),
    width: 80,
  },
  {
    id: "price",
    title: intl.formatMessage(columnsMessages.price),
    width: 150,
  },
  {
    id: "total",
    title: intl.formatMessage(columnsMessages.total),
    width: 150,
  },
  {
    id: "isGift",
    title: intl.formatMessage(columnsMessages.isGift),
    width: 150,
  },
];

interface GetCellContentProps {
  columns: AvailableColumn[];
  data: OrderLineFragment[];
  loading: boolean;
  intl: IntlShape;
  locale: Locale;
  onOrderLineShowMetadata: (id: string) => void;
}

const isLineDiscounted = (line: OrderLineFragment): boolean =>
  line.unitPrice.gross.amount < line.undiscountedUnitPrice.gross.amount ||
  (line.discounts?.length ?? 0) > 0;

export const createGetCellContent =
  ({ columns, data, loading, onOrderLineShowMetadata, intl, locale }: GetCellContentProps) =>
  ([column, row]: Item, { added, removed }: GetCellContentOpts): GridCell => {
    if (loading) {
      return loadingCell();
    }

    const columnId = columns[column]?.id;
    const rowData = added.includes(row) ? undefined : data[getDatagridRowDataIndex(row, removed)];

    if (!rowData || !columnId) {
      return readonlyTextCell("", false);
    }

    if (isFirstColumn(column)) {
      return readonlyTextCell("", false);
    }

    switch (columnId) {
      case "product":
        return thumbnailCell(
          rowData?.productName ?? "",
          rowData.thumbnail?.url ?? "",
          readonyOptions,
        );
      case "sku":
        return readonlyTextCell(rowData.productSku ?? "", false);
      case "variantName":
        return readonlyTextCell(rowData?.variant?.name ?? "-", false);
      case "quantity":
        return readonlyTextCell(rowData.quantity.toString(), false);
      case "price":
        if (isLineDiscounted(rowData)) {
          return moneyDiscountedCell(
            {
              value: rowData.unitPrice.gross.amount,
              currency: rowData.unitPrice.gross.currency,
              undiscounted: rowData.undiscountedUnitPrice.gross.amount,
              lineItemId: rowData.id,
              locale,
            },
            readonyOptions,
          );
        }

        return moneyCell(
          rowData.unitPrice.gross.amount,
          rowData.unitPrice.gross.currency,
          readonyOptions,
        );

      case "total":
        if (isLineDiscounted(rowData)) {
          return moneyDiscountedCell(
            {
              value: rowData.totalPrice.gross.amount,
              currency: rowData.totalPrice.gross.currency,
              undiscounted: rowData.undiscountedTotalPrice.gross.amount,
              lineItemId: rowData.id,
              locale,
            },
            readonyOptions,
          );
        }

        return moneyCell(
          rowData.totalPrice.gross.amount,
          rowData.totalPrice.gross.currency,
          readonyOptions,
        );
      case "isGift":
        return booleanCell(rowData?.isGift, {
          readonly: true,
          allowOverlay: false,
        });
      case "metadata":
        return buttonCell(intl.formatMessage(commonMessages.viewMetadata), () => {
          onOrderLineShowMetadata(rowData.id);
        });

      default:
        return readonlyTextCell("", false);
    }
  };

export { isLineDiscounted };

const readonyOptions: Partial<GridCell> = {
  allowOverlay: false,
  readonly: true,
};
