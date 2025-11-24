// @ts-strict-ignore
import {
  booleanCell,
  buttonCell,
  loadingCell,
  moneyCell,
  readonlyTextCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { OrderLineFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getDatagridRowDataIndex, isFirstColumn } from "@dashboard/misc";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape } from "react-intl";

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
  onOrderLineShowMetadata: (id: string) => void;
}

export const createGetCellContent =
  ({ columns, data, loading, onOrderLineShowMetadata, intl }: GetCellContentProps) =>
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
        return moneyCell(
          rowData.unitPrice.gross.amount,
          rowData.unitPrice.gross.currency,
          readonyOptions,
        );

      case "total":
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

const readonyOptions: Partial<GridCell> = {
  allowOverlay: false,
  readonly: true,
};
