import { moneyCell, readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type Locale } from "@dashboard/components/Locale";
import { type OrderDraft } from "@dashboard/orders/types";
import { type Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export function formatDateTime(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(date),
  );
}

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
    {
      id: "channel",
      title: intl.formatMessage(columnsMessages.channel),
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
        try {
          return readonlyTextCell(formatDateTime(rowData.created, locale));
        } catch (e) {
          return readonlyTextCell("-");
        }
      case "customer":
        return readonlyTextCell(getCustomerName(rowData));
      case "total":
        return moneyCell(rowData.total?.gross?.amount ?? 0, rowData.total?.gross?.currency ?? "", {
          cursor: "pointer",
          readonly: true,
        });
      case "channel":
        return readonlyTextCell(rowData.channel?.name ?? "-");
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
