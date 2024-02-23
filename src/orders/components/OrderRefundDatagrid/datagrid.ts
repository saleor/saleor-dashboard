import {
  dateCell,
  moneyCell,
  readonlyTextCell,
  tagsCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import {
  UseDatagridChangeState,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { OrderDetailsFragment } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import { getStatusColor } from "@dashboard/misc";
import { ListSettings, ListViews } from "@dashboard/types";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { DefaultTheme, useTheme } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { refundGridMessages } from "./messages";

const useOrderRefundConstantColumns = () => {
  const intl = useIntl();
  return [
    {
      id: "status",
      title: intl.formatMessage(refundGridMessages.statusCell),
      width: 80,
    },
    {
      id: "amount",
      title: intl.formatMessage(refundGridMessages.amountCell),
      width: 150,
    },
    {
      id: "reason",
      title: intl.formatMessage(refundGridMessages.reasonCell),
      width: 300,
    },
    {
      id: "date",
      title: intl.formatMessage(refundGridMessages.dateCell),
      width: 300,
    },
    {
      id: "account",
      title: intl.formatMessage(refundGridMessages.accountCell),
      width: 300,
    },
  ];
};

export const useOrderRefundStaticColumns = () => {
  const emptyColumn = useEmptyColumn();
  const constantColumns = useOrderRefundConstantColumns();
  return [emptyColumn, ...constantColumns];
};

export const createGetCellContent =
  ({
    refunds,
    columns,
    currentTheme,
  }: {
    refunds: OrderDetailsFragment["grantedRefunds"] | undefined;
    columns: AvailableColumn[];
    currentTheme: DefaultTheme;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData = refunds?.[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    // TODO: replace with actual status when API available
    const color = getStatusColor({
      status: "generic",
      currentTheme,
    });

    switch (columnId) {
      case "status":
        return tagsCell(
          [
            {
              tag: "DRAFT",
              color: color.base,
            },
          ],
          ["DRAFT"],
        );
      case "amount":
        return moneyCell(rowData.amount.amount, rowData.amount.currency ?? "", {
          readonly: true,
        });
      case "reason":
        return readonlyTextCell(rowData.reason ?? "", false);
      case "date":
        return dateCell(rowData.createdAt);
      case "account":
        return readonlyTextCell(rowData.user?.email ?? "", false);
      default:
        return readonlyTextCell("");
    }
  };

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
