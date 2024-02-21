import {
  dateCell,
  moneyCell,
  readonlyTextCell,
  tagsCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { OrderDetailsFragment } from "@dashboard/graphql";
import { getStatusColor } from "@dashboard/misc";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { DefaultTheme } from "@saleor/macaw-ui-next";
import { IntlShape } from "react-intl";

import { refundGridMessages } from "./messages";

export const orderRefundStaticColumnsAdapter = (
  emptyColumn: AvailableColumn,
  intl: IntlShape,
) => [
  emptyColumn,
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
        return readonlyTextCell(rowData.reason ?? "");
      case "date":
        return dateCell(rowData.createdAt);
      case "account":
        return readonlyTextCell(rowData.user?.email ?? "");
      default:
        return readonlyTextCell("");
    }
  };
