import {
  loadingCell,
  moneyCell,
  readonlyTextCell,
  tagsCell,
  textCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Locale } from "@dashboard/components/Locale";
import { getMoney } from "@dashboard/components/Money/utils";
import { OrderListQuery } from "@dashboard/graphql";
import { transformOrderStatus, transformPaymentStatus } from "@dashboard/misc";
import { OrderListUrlSortField } from "@dashboard/orders/urls";
import { RelayToFlat, Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { themes } from "@saleor/macaw-ui/next";
import moment from "moment-timezone";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const getColumns = (
  intl: IntlShape,
  sort: Sort<OrderListUrlSortField>,
): AvailableColumn[] => [
  {
    id: "empty",
    title: "",
    width: 20,
  },
  {
    id: "number",
    title: intl.formatMessage(columnsMessages.number),
    width: 100,
    icon: getColumnSortDirectionIcon(sort, OrderListUrlSortField.number),
  },
  {
    id: "date",
    title: intl.formatMessage(columnsMessages.date),
    width: 200,
    icon: getColumnSortDirectionIcon(sort, OrderListUrlSortField.date),
  },
  {
    id: "customer",
    title: intl.formatMessage(columnsMessages.customer),
    width: 200,
    icon: getColumnSortDirectionIcon(sort, OrderListUrlSortField.customer),
  },
  {
    id: "payment",
    title: intl.formatMessage(columnsMessages.payment),
    width: 200,
    icon: getColumnSortDirectionIcon(sort, OrderListUrlSortField.payment),
  },
  {
    id: "status",
    title: intl.formatMessage(columnsMessages.status),
    width: 200,
    icon: getColumnSortDirectionIcon(sort, OrderListUrlSortField.fulfillment),
  },
  {
    id: "total",
    title: intl.formatMessage(columnsMessages.total),
    width: 150,
  },
];

interface GetCellContentProps {
  columns: AvailableColumn[];
  orders: RelayToFlat<OrderListQuery["orders"]>;
  loading: boolean;
  locale: Locale;
  intl: IntlShape;
  theme: typeof themes.defaultDark;
}

export function createGetCellContent({
  columns,
  orders,
  loading,
  locale,
  intl,
  theme,
}: GetCellContentProps) {
  return (
    [column, row]: Item,
    { added, removed }: GetCellContentOpts,
  ): GridCell => {
    if ([-1, 0].includes(column)) {
      return readonlyTextCell("");
    }

    if (loading) {
      return loadingCell();
    }

    const columnId = columns[column].id;
    const rowData = added.includes(row)
      ? undefined
      : orders[row + removed.filter(r => r <= row).length];

    switch (columnId) {
      case "number":
        return readonlyTextCell(rowData.number);
      case "date":
        return getDateCellContent(locale, rowData);
      case "customer":
        return getCustomerCellContent(rowData);
      case "payment":
        return getPaymentCellContent(intl, theme, rowData);
      case "status":
        return getStatusCellContent(intl, theme, rowData);
      case "total":
        return getTotalCellContent(locale, rowData);
      default:
        return textCell("");
    }
  };
}

function getDateCellContent(
  locale: Locale,
  rowData: RelayToFlat<OrderListQuery["orders"]>[number],
) {
  return readonlyTextCell(moment(rowData.created).locale(locale).format("lll"));
}

function getCustomerCellContent(
  rowData: RelayToFlat<OrderListQuery["orders"]>[number],
) {
  if (rowData.billingAddress) {
    return readonlyTextCell(
      `${rowData.billingAddress.firstName} ${rowData.billingAddress.lastName}`,
    );
  }

  if (rowData.userEmail) {
    return readonlyTextCell(rowData.userEmail);
  }

  return readonlyTextCell("-");
}

function getPaymentCellContent(
  intl: IntlShape,
  theme: typeof themes.defaultDark,
  rowData: RelayToFlat<OrderListQuery["orders"]>[number],
) {
  const paymentStatus = transformPaymentStatus(rowData.paymentStatus, intl);
  if (paymentStatus?.status) {
    return tagsCell(
      [
        {
          tag: paymentStatus.localized,
          color: getStatusColor(paymentStatus.status, theme),
        },
      ],
      [paymentStatus.localized],
      { cursor: "pointer" },
    );
  }

  return readonlyTextCell("-");
}

function getStatusCellContent(
  intl: IntlShape,
  theme: typeof themes.defaultDark,
  rowData: RelayToFlat<OrderListQuery["orders"]>[number],
) {
  const status = transformOrderStatus(rowData.status, intl);

  if (status) {
    return tagsCell(
      [{ tag: status.localized, color: getStatusColor(status.status, theme) }],
      [status.localized],
      { cursor: "pointer" },
    );
  }

  return readonlyTextCell("-");
}

function getStatusColor(
  status: string,
  theme: typeof themes.defaultDark,
): string {
  switch (status) {
    case "error":
      return theme.colors.background.surfaceCriticalDepressed;
    case "warning":
      // TODO: replace when warning will be added to theme
      return "#FBE5AC";
    case "success":
      return theme.colors.background.decorativeSurfaceSubdued2;
    case "info":
      return theme.colors.background.surfaceBrandDepressed;
    default:
      return theme.colors.background.surfaceBrandSubdued;
  }
}

function getTotalCellContent(
  locale: Locale,
  rowData: RelayToFlat<OrderListQuery["orders"]>[number],
) {
  if (rowData?.total?.gross) {
    return moneyCell(
      getMoney(rowData.total.gross, locale),
      rowData.total.gross.currency,
      { cursor: "pointer" },
    );
  }

  return readonlyTextCell("-");
}
