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
import useLocale from "@dashboard/hooks/useLocale";
import { transformOrderStatus, transformPaymentStatus } from "@dashboard/misc";
import { OrderListUrlSortField } from "@dashboard/orders/urls";
import { RelayToFlat, Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { DefaultTheme, themes, useTheme } from "@saleor/macaw-ui/next";
import moment from "moment-timezone";
import { IntlShape, useIntl } from "react-intl";

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
}

export const useGetCellContent = ({
  columns,
  orders,
  loading,
}: GetCellContentProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const { theme: currentTheme } = useTheme();
  const theme = themes[currentTheme];

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
        return getPaymentCellContent(intl, theme, currentTheme, rowData);
      case "status":
        return getStatusCellContent(intl, theme, currentTheme, rowData);
      case "total":
        return getTotalCellContent(locale, rowData);
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

export function getPaymentCellContent(
  intl: IntlShape,
  theme: typeof themes.defaultDark,
  currentTheme: DefaultTheme,
  rowData: RelayToFlat<OrderListQuery["orders"]>[number],
) {
  const paymentStatus = transformPaymentStatus(rowData.paymentStatus, intl);
  if (paymentStatus?.status) {
    return tagsCell(
      [
        {
          tag: paymentStatus.localized,
          color: getStatusColor(paymentStatus.status, theme, currentTheme),
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
  theme: typeof themes.defaultDark,
  currentTheme: DefaultTheme,
  rowData: RelayToFlat<OrderListQuery["orders"]>[number],
) {
  const status = transformOrderStatus(rowData.status, intl);

  if (status) {
    return tagsCell(
      [
        {
          tag: status.localized,
          color: getStatusColor(status.status, theme, currentTheme),
        },
      ],
      [status.localized],
      { cursor: "pointer" },
    );
  }

  return readonlyTextCell("-");
}

function getStatusColor(
  status: string,
  theme: typeof themes.defaultDark,
  currentTheme: DefaultTheme,
): string {
  switch (status) {
    case "error":
      return theme.colors.background.surfaceCriticalDepressed;
    case "warning":
      // TODO: replace when warning will be added to theme
      return currentTheme === "defaultDark" ? "#FBE5AC" : "#FBE5AC";
    case "success":
      return theme.colors.background.decorativeSurfaceSubdued2;
    case "info":
      return theme.colors.background.surfaceBrandDepressed;
    default:
      return theme.colors.background.surfaceBrandSubdued;
  }
}

export function getTotalCellContent(
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
