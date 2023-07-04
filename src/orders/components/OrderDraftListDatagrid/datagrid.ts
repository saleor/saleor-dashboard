// @ts-strict-ignore
import {
  moneyCell,
  readonlyTextCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Locale } from "@dashboard/components/Locale";
import { OrderDraftListQuery } from "@dashboard/graphql";
import { RelayToFlat, Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import moment from "moment";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const getColumns = (intl: IntlShape, sort: Sort): AvailableColumn[] => [
  {
    id: "number",
    title: intl.formatMessage(columnsMessages.number),
    width: 100,
    icon: getColumnSortDirectionIcon(sort, "number"),
  },
  {
    id: "date",
    title: intl.formatMessage(columnsMessages.date),
    width: 200,
    icon: getColumnSortDirectionIcon(sort, "date"),
  },
  {
    id: "customer",
    title: intl.formatMessage(columnsMessages.customer),
    width: 200,
    icon: getColumnSortDirectionIcon(sort, "customer"),
  },
  {
    id: "total",
    title: intl.formatMessage(columnsMessages.total),
    width: 200,
    icon: getColumnSortDirectionIcon(sort, "total"),
  },
];

export const createGetCellContent =
  ({
    orders,
    locale,
    columns,
  }: {
    orders: RelayToFlat<OrderDraftListQuery["draftOrders"]>;
    columns: AvailableColumn[];
    locale: Locale;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData = orders[row];
    const columnId = columns[column]?.id;

    if (!columnId) {
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
            readonly: true,
          },
        );
    }
  };

export function getCustomerName(
  rowData: RelayToFlat<OrderDraftListQuery["draftOrders"]>[number],
) {
  if (rowData?.billingAddress?.firstName && rowData?.billingAddress?.lastName) {
    return `${rowData.billingAddress.firstName} ${rowData.billingAddress.lastName}`;
  }

  if (rowData.userEmail) {
    return rowData.userEmail;
  }

  return "-";
}
