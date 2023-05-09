import {
  loadingCell,
  moneyCell,
  readonlyTextCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { OrderLineFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
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
  const { locale } = useLocale();
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
          );
        case "sku":
          return readonlyTextCell(rowData.productSku ?? "", false);
        case "quantity":
          return readonlyTextCell(rowData.quantity.toString(), false);
        case "price":
          return moneyCell({
            value: rowData.unitPrice.gross.amount,
            currency: rowData.unitPrice.gross.currency,
            locale,
          });

        case "total":
          return moneyCell({
            value: rowData.totalPrice.gross.amount,
            currency: rowData.totalPrice.gross.currency,
            locale,
          });

        default:
          return readonlyTextCell("", false);
      }
    },
    [columns, data, loading, locale],
  );

  return getCellContent;
};
