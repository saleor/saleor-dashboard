import {
  loadingCell,
  moneyCell,
  readonlyTextCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { OrderLineFragment } from "@dashboard/graphql";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const getColumns = (intl: IntlShape): AvailableColumn[] => [
  {
    id: "empty",
    title: "",
    width: 20,
  },
  {
    id: "product",
    title: intl.formatMessage(columnsMessages.product),
    width: 300,
  },
  {
    id: "sku",
    title: intl.formatMessage(columnsMessages.sku),
    width: 100,
  },
  {
    id: "quantity",
    title: intl.formatMessage(columnsMessages.quantity),
    width: 100,
  },
  {
    id: "price",
    title: intl.formatMessage(columnsMessages.price),
    width: 100,
  },
  {
    id: "total",
    title: intl.formatMessage(columnsMessages.total),
    width: 100,
  },
];

interface GetCellContentProps {
  columns: AvailableColumn[];
  data: OrderLineFragment[];
  loading: boolean;
}

export const getCellContentCreator =
  ({ columns, data, loading }: GetCellContentProps) =>
  ([column, row]: Item, { added, removed }: GetCellContentOpts): GridCell => {
    if ([-1, 0].includes(column)) {
      return readonlyTextCell("", false);
    }

    if (loading) {
      return loadingCell();
    }

    const columnId = columns[column].id;
    const rowData = added.includes(row)
      ? undefined
      : data[row + removed.filter(r => r <= row).length];

    if (!rowData) {
      return readonlyTextCell("", false);
    }

    switch (columnId) {
      case "product":
        return thumbnailCell(
          rowData?.productName ?? "",
          rowData.thumbnail?.url ?? "",
        );
      case "sku":
        return readonlyTextCell(rowData.productSku ?? "", false);
      case "quantity":
        return readonlyTextCell(rowData.quantity.toString(), false);
      case "price":
        return moneyCell(
          rowData.unitPrice.gross.amount,
          rowData.unitPrice.gross.currency,
        );

      case "total":
        return moneyCell(
          rowData.totalPrice.gross.amount,
          rowData.totalPrice.gross.currency,
        );

      default:
        return readonlyTextCell("", false);
    }
  };
