import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import {
  readonlyTextCell,
  tagsCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { DotStatus } from "@dashboard/components/StatusDot/StatusDot";
import { getStatusColor } from "@dashboard/misc";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { ThemeTokensValues } from "@saleor/macaw-ui-next";
import { IntlShape } from "react-intl";

import { columnsMessages, messages } from "./messages";
import { VoucherCode } from "./types";

export const voucherCodesStaticColumnsAdapter = (intl: IntlShape) => [
  {
    id: "code",
    title: intl.formatMessage(columnsMessages.code),
    width: 400,
  },
  {
    id: "usage",
    title: intl.formatMessage(columnsMessages.usage),
    width: 150,
  },
  {
    id: "status",
    title: intl.formatMessage(columnsMessages.status),
    width: 150,
  },
];

export const createGetCellContent =
  (
    voucherCodes: VoucherCode[],
    columns: AvailableColumn[],
    intl: IntlShape,
    themeValues: ThemeTokensValues,
  ) =>
  ([column, row]: Item): GridCell => {
    const columnId = columns[column]?.id;
    const rowData: VoucherCode | undefined = voucherCodes[row];

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "code":
        return readonlyTextCell(rowData?.code ?? "", false);
      case "usage":
        return readonlyTextCell(
          rowData?.used?.toString() ?? PLACEHOLDER,
          false,
        );
      case "status": {
        const status = getStatus(rowData?.isActive);
        const statusColor = getStatusColor(status);
        const statusMessage = getStatusMessage(rowData?.isActive, intl);

        return tagsCell(
          [
            {
              tag: statusMessage,
              color: getTagCellColor(statusColor, themeValues),
            },
          ],
          [statusMessage],
          {
            readonly: true,
            allowOverlay: false,
          },
        );
      }
      default:
        return readonlyTextCell("", false);
    }
  };

function getStatus(isActive: boolean | undefined): DotStatus {
  if (isActive === undefined) {
    return "warning";
  }
  return isActive ? "success" : "error";
}

function getStatusMessage(isActive: boolean | undefined, intl: IntlShape) {
  if (isActive === undefined) {
    return intl.formatMessage(messages.draft);
  }

  return isActive
    ? intl.formatMessage(messages.active)
    : intl.formatMessage(messages.inactive);
}

function getTagCellColor(
  color: string,
  currentTheme: ThemeTokensValues,
): string {
  if (color.startsWith("#")) {
    return color;
  }

  return currentTheme.colors.background[
    color as keyof ThemeTokensValues["colors"]["background"]
  ];
}
