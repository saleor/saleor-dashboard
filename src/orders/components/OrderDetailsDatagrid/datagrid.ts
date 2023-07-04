// @ts-strict-ignore
import {
  loadingCell,
  moneyCell,
  readonlyTextCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { OrderLineFragment } from "@dashboard/graphql";
import { getDatagridRowDataIndex } from "@dashboard/misc";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { columnsMessages } from "./messages";

export const useColumns = (): AvailableColumn[] => {
  const intl = useIntl();

  const columns = useMemo(
    () => [
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
    ],
    [intl],
  );

  return columns;
};

interface GetCellContentProps {
  columns: AvailableColumn[];
  data: OrderLineFragment[];
  loading: boolean;
}

export const useGetCellContent = ({
  columns,
  data,
  loading,
}: GetCellContentProps) => {
  const getCellContent = useCallback(
    ([column, row]: Item, { added, removed }: GetCellContentOpts): GridCell => {
      if (loading) {
        return loadingCell();
      }

      const columnId = columns[column].id;
      const rowData = added.includes(row)
        ? undefined
        : data[getDatagridRowDataIndex(row, removed)];

      if (!rowData) {
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

        default:
          return readonlyTextCell("", false);
      }
    },
    [columns, data, loading],
  );

  return getCellContent;
};

const readonyOptions: Partial<GridCell> = {
  allowOverlay: false,
  readonly: true,
};
