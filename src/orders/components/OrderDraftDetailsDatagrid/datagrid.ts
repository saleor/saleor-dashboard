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
import { OrderErrorFragment, OrderSharedType } from "@dashboard/orders/types";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { useTheme } from "@saleor/macaw-ui/next";
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
  const { themeValues } = useTheme();

  return (
    [column, row]: Item,
    { added, removed }: GetCellContentOpts,
  ): GridCell => {
    if ([-1, 0].includes(column)) {
      return readonlyTextCell("", false);
    }

    if (loading) {
      return loadingCell();
    }

    const columnId = columns[column].id;
    const rowData = added.includes(row)
      ? undefined
      : lines[row + removed.filter(r => r <= row).length];

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
        const orderErrors = errors.find(error =>
          error.orderLines?.some(id => id === rowData.id),
        );
        const status = getOrderLineStatus(intl, rowData, orderErrors);

        return tagsCell(
          status.map(({ status, type }) => ({
            color:
              type === "warning"
                ? "#FBE5AC"
                : themeValues.colors.background.surfaceCriticalDepressed,
            tag: status,
          })),
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

const getOrderLineStatus = (
  intl: IntlShape,
  line: OrderSharedType["lines"][number],
  error?: OrderErrorFragment,
) => {
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
      type: "error",
      status: "Error 1234",
    });
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
