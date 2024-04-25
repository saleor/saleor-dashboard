import {
  moneyCell,
  numberCell,
  readonlyTextCell,
  textCell,
  thumbnailCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import {
  UseDatagridChangeState,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import { ListSettings, ListViews } from "@dashboard/types";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { DefaultTheme, useTheme } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { LineToRefund } from "../../OrderTransactionRefundPage";
import { getMaxQtyToRefund } from "../../utils";
import { transactionRefundGridMessages } from "./messages";

export const useOrderTransactionRefundStaticColumns = () => {
  const intl = useIntl();

  return [
    {
      id: "product",
      title: intl.formatMessage(transactionRefundGridMessages.productCell),
      width: 300,
    },
    {
      id: "unitPrice",
      title: intl.formatMessage(transactionRefundGridMessages.unitPriceCell),
      width: 150,
    },
    {
      id: "qtyOrdered",
      title: intl.formatMessage(transactionRefundGridMessages.qtyOrderedCell),
      width: 150,
    },
    {
      id: "maxQty",
      title: intl.formatMessage(transactionRefundGridMessages.maxQtyCell),
      width: 150,
    },
    {
      id: "qtyToRefund",
      title: intl.formatMessage(transactionRefundGridMessages.qtyToRefundCell),
      width: 150,
    },
    {
      id: "reason",
      title: intl.formatMessage(transactionRefundGridMessages.reasonToRefundCell),
      width: 250,
    },
  ];
};

// Export this as global datagrid util
const readonlyOptions: Partial<GridCell> = {
  allowOverlay: false,
  readonly: true,
};

export const createGetCellContent =
  ({
    lines,
    columns,
    linesToRefund,
    order,
    draftRefund,
  }: {
    lines: OrderDetailsGrantRefundFragment["lines"] | undefined;
    columns: AvailableColumn[];
    linesToRefund: LineToRefund[];
    order: OrderDetailsGrantRefundFragment | null | undefined;
    draftRefund: OrderDetailsGrantRefundFragment["grantedRefunds"][0] | undefined;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData = lines?.[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "product":
        return thumbnailCell(
          rowData?.productName ?? "",
          rowData.thumbnail?.url ?? "",
          readonlyOptions,
        );
      case "unitPrice":
        return moneyCell(
          rowData.unitPrice.gross.amount,
          rowData.unitPrice.gross.currency,
          readonlyOptions,
        );
      case "qtyOrdered":
        return readonlyTextCell(rowData.quantity.toString(), false);
      case "maxQty":
        return readonlyTextCell(
          getMaxQtyToRefund({ rowData, order, draftRefund }).toString(),
          false,
        );
      case "qtyToRefund": {
        const line = linesToRefund?.find(q => q.row === row);

        return numberCell(line?.quantity ?? 0, { cursor: "pointer" });
      }
      case "reason": {
        const line = linesToRefund?.find(q => q.row === row);

        return textCell(line?.reason ?? "");
      }
      default:
        return readonlyTextCell("", false);
    }
  };

// export this as global datagrid util
export const useDatagridOpts = (
  view: ListViews,
): {
  datagrid: UseDatagridChangeState;
  currentTheme: DefaultTheme;
  settings: ListSettings;
  handleColumnChange: (picked: string[]) => void;
} => {
  const datagrid = useDatagridChangeState();
  const { theme: currentTheme } = useTheme();
  const { updateListSettings, settings } = useListSettings(view);

  const handleColumnChange = React.useCallback(
    picked => {
      if (updateListSettings) {
        updateListSettings("columns", picked.filter(Boolean));
      }
    },
    [updateListSettings],
  );

  return {
    datagrid,
    currentTheme,
    settings,
    handleColumnChange,
  };
};
