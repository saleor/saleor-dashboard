// @ts-strict-ignore
import {
  moneyCell,
  readonlyTextCell,
  tagsCell,
  textCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Locale } from "@dashboard/components/Locale";
import { OrderListQuery } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import {
  getStatusColor,
  transformOrderStatus,
  transformPaymentStatus,
} from "@dashboard/misc";
import { OrderListUrlSortField } from "@dashboard/orders/urls";
import { RelayToFlat, Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item, TextCell } from "@glideapps/glide-data-grid";
import {
  DefaultTheme,
  ThemeTokensValues,
  useTheme,
} from "@saleor/macaw-ui/next";
import moment from "moment-timezone";
import { IntlShape, useIntl } from "react-intl";

import { columnsMessages } from "./messages";

export const orderListStaticColumnAdapter = (
  emptyColumn: AvailableColumn,
  intl: IntlShape,
  sort: Sort<OrderListUrlSortField>,
) =>
  [
    emptyColumn,
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
      id: "payment",
      title: intl.formatMessage(columnsMessages.payment),
      width: 200,
    },
    {
      id: "status",
      title: intl.formatMessage(columnsMessages.status),
      width: 200,
    },
    {
      id: "total",
      title: intl.formatMessage(columnsMessages.total),
      width: 150,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

interface GetCellContentProps {
  columns: AvailableColumn[];
  orders: RelayToFlat<OrderListQuery["orders"]>;
}

function getDatagridRowDataIndex(row, removeArray) {
  return row + removeArray.filter(r => r <= row).length;
}

export const useGetCellContent = ({ columns, orders }: GetCellContentProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const { theme: currentTheme, themeValues } = useTheme();

  return (
    [column, row]: Item,
    { added, removed }: GetCellContentOpts,
  ): GridCell => {
    const columnId = columns[column]?.id;

    if (!columnId) {
      return readonlyTextCell("");
    }

    const rowData = added.includes(row)
      ? undefined
      : orders[getDatagridRowDataIndex(row, removed)];

    switch (columnId) {
      case "number":
        return readonlyTextCell(rowData.number);
      case "date":
        return getDateCellContent(locale, rowData);
      case "customer":
        return getCustomerCellContent(rowData);
      case "payment":
        return getPaymentCellContent(intl, themeValues, currentTheme, rowData);
      case "status":
        return getStatusCellContent(intl, themeValues, currentTheme, rowData);
      case "total":
        return getTotalCellContent(rowData);
      default:
        return textCell("");
    }
  };
};

export function getDateCellContent(
  locale: Locale,
  rowData: RelayToFlat<OrderListQuery["orders"]>[number],
) {
  return readonlyTextCell(moment(rowData.created).locale(locale).format("lll"));
}

export function getCustomerCellContent(
  rowData: RelayToFlat<OrderListQuery["orders"]>[number],
): TextCell {
  if (rowData?.billingAddress?.firstName && rowData?.billingAddress?.lastName) {
    return readonlyTextCell(
      `${rowData.billingAddress.firstName} ${rowData.billingAddress.lastName}`,
    );
  }

  if (rowData.userEmail) {
    return readonlyTextCell(rowData.userEmail);
  }

  return readonlyTextCell("-");
}

export function getPaymentCellContent(
  intl: IntlShape,
  theme: ThemeTokensValues,
  currentTheme: DefaultTheme,
  rowData: RelayToFlat<OrderListQuery["orders"]>[number],
) {
  const paymentStatus = transformPaymentStatus(rowData.paymentStatus, intl);
  if (paymentStatus?.status) {
    const statusColor = getStatusColor(paymentStatus.status, currentTheme);

    return tagsCell(
      [
        {
          tag: paymentStatus.localized,
          color: statusColor.startsWith("#")
            ? statusColor
            : theme.colors.background[statusColor],
        },
      ],
      [paymentStatus.localized],
      { cursor: "pointer" },
    );
  }

  return readonlyTextCell("-");
}

export function getStatusCellContent(
  intl: IntlShape,
  theme: ThemeTokensValues,
  currentTheme: DefaultTheme,
  rowData: RelayToFlat<OrderListQuery["orders"]>[number],
) {
  const status = transformOrderStatus(rowData.status, intl);
  const statusColor = getStatusColor(status.status, currentTheme);

  if (status) {
    return tagsCell(
      [
        {
          tag: status.localized,
          color: statusColor.startsWith("#")
            ? statusColor
            : theme.colors.background[statusColor],
        },
      ],
      [status.localized],
      { cursor: "pointer" },
    );
  }

  return readonlyTextCell("-");
}

export function getTotalCellContent(
  rowData: RelayToFlat<OrderListQuery["orders"]>[number],
) {
  if (rowData?.total?.gross) {
    return moneyCell(rowData.total.gross.amount, rowData.total.gross.currency, {
      cursor: "pointer",
    });
  }

  return readonlyTextCell("-");
}
