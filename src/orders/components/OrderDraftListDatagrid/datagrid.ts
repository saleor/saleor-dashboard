import {
  moneyCell,
  readonlyTextCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Locale } from "@dashboard/components/Locale";
import { OrderDraft } from "@dashboard/orders/types";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import moment from "moment";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const orderDraftListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort,
): AvailableColumn[] =>
  [
    {
      id: "number",
      title: intl.formatMessage(columnsMessages.number),
      width: 100,
    },
    {
      id: "date",
      title: intl.formatMessage(columnsMessages.date),
      width: 200,
    },
    {
      id: "customer",
      title: intl.formatMessage(columnsMessages.customer),
      width: 200,
    },
    {
      id: "total",
      title: intl.formatMessage(columnsMessages.total),
      width: 200,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const createGetCellContent =
  ({
    orders,
    locale,
    columns,
  }: {
    orders: OrderDraft[];
    columns: AvailableColumn[];
    locale: Locale;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData: OrderDraft | undefined = orders[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "number":
        return readonlyTextCell(`#${rowData.number}`);
      case "date":
        return readonlyTextCell(
          moment(rowData.created).locale(locale).format("lll"),
        );
      case "customer":
        return readonlyTextCell(getCustomerName(rowData));
      case "total":
        return moneyCell(
          rowData.total?.gross?.amount ?? 0,
          rowData.total?.gross?.currency ?? "",
          {
            cursor: "pointer",
            readonly: true,
          },
        );
      default:
        return readonlyTextCell("");
    }
  };

export function getCustomerName(rowData: OrderDraft) {
  if (rowData?.billingAddress?.firstName && rowData?.billingAddress?.lastName) {
    return `${rowData.billingAddress.firstName} ${rowData.billingAddress.lastName}`;
  }

  if (rowData.userEmail) {
    return rowData.userEmail;
  }

  return "-";
}
