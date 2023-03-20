import {
  loadingCell,
  moneyCell,
  readonlyTextCell,
  tagsCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import {
  getDatagridRowDataIndex,
  getStatusColor,
  isFirstColumn,
} from "@dashboard/misc";
import { OrderErrorFragment, OrderSharedType } from "@dashboard/orders/types";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { DefaultTheme, useTheme } from "@saleor/macaw-ui/next";
import { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";

import { lineAlertMessages } from "../OrderDraftDetailsProducts/messages";
import { columnsMessages } from "./messages";

export const useColumns = () => {
  const emptyColumn = useEmptyColumn();
  const intl = useIntl();

  const availableColumns = useMemo(
    () => [
      emptyColumn,
      {
        id: "product",
        title: intl.formatMessage(columnsMessages.product),
        width: 300,
      },
      {
        id: "status",
        title: "Status",
        width: 250,
      },
      {
        id: "quantity",
        title: intl.formatMessage(columnsMessages.quantity),
        width: 150,
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
    [emptyColumn, intl],
  );

  return {
    availableColumns,
  };
};

interface GetCellContentProps {
  columns: AvailableColumn[];
  loading: boolean;
  lines: OrderSharedType["lines"];
  errors: OrderErrorFragment[];
}

export const useGetCellContent = ({
  columns,
  loading,
  lines,
  errors,
}: GetCellContentProps) => {
  const intl = useIntl();
  const { theme } = useTheme();

  return (
    [column, row]: Item,
    { added, removed }: GetCellContentOpts,
  ): GridCell => {
    if (isFirstColumn(column)) {
      return readonlyTextCell("", false);
    }

    if (loading) {
      return loadingCell();
    }

    const columnId = columns[column].id;
    const rowData = added.includes(row)
      ? undefined
      : lines[getDatagridRowDataIndex(row, removed)];

    if (!rowData) {
      return readonlyTextCell("", false);
    }

    switch (columnId) {
      case "product":
        return thumbnailCell(
          rowData?.productName ?? "",
          rowData.thumbnail?.url ?? "",
        );
      case "quantity":
        return readonlyTextCell(rowData.quantity.toString(), false);
      case "price":
        return moneyCell(
          rowData.unitPrice.gross.amount,
          rowData.unitPrice.gross.currency,
        );
      case "status":
        const orderErrors = getOrderErrors(errors, rowData.id);
        const status = getOrderLineStatus(intl, rowData, orderErrors);

        return tagsCell(
          status.map(toTagValue(theme)),
          status.map(status => status.status),
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
};

function toTagValue(currentTheme: DefaultTheme) {
  return ({ status, type }: OrderStatus) => ({
    color: getStatusColor(type, currentTheme),
    tag: status,
  });
}

interface OrderStatus {
  type: "warning" | "error";
  status: string;
}

const getOrderLineStatus = (
  intl: IntlShape,
  line: OrderSharedType["lines"][number],
  error?: OrderErrorFragment,
): OrderStatus[] => {
  const statuses = [];

  if (error) {
    statuses.push({
      type: "error",
      status: getOrderErrorMessage(error, intl),
    });
  }

  const product = line.variant?.product;

  if (!product) {
    statuses.push({
      type: "warning",
      status: intl.formatMessage(lineAlertMessages.notExists),
    });
  }

  const isAvailableForPurchase = product?.isAvailableForPurchase;

  if (product && !isAvailableForPurchase) {
    statuses.push({
      type: "warning",
      status: intl.formatMessage(lineAlertMessages.notAvailable),
    });
  }

  return statuses;
};

function getOrderErrors(errors: OrderErrorFragment[], id: string) {
  return errors.find(error => error.orderLines?.some(lineId => lineId === id));
}
