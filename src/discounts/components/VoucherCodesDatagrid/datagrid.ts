import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import {
  readonlyTextCell,
  tagsCell,
  textCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { getStatusColor } from "@dashboard/misc";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type DefaultTheme } from "@saleor/macaw-ui-next";
import { type IntlShape } from "react-intl";

import {
  getVoucherCodeStatusDot,
  getVoucherCodeStatusLabel,
} from "../VoucherCodesTable/voucherCodeStatus";
import { columnsMessages } from "./messages";
import { type VoucherCode } from "./types";

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
    currentTheme: DefaultTheme,
  ) =>
  ([column, row]: Item): GridCell => {
    const columnId = columns[column]?.id;
    const rowData: VoucherCode | undefined = voucherCodes[row];

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "code":
        return textCell(rowData?.code ?? "", {
          readonly: true,
          allowOverlay: true,
        });
      case "usage":
        return readonlyTextCell(rowData?.used?.toString() ?? PLACEHOLDER, false);
      case "status": {
        const status = getVoucherCodeStatusDot(rowData?.isActive);
        const color = getStatusColor({
          status: status === "success" || status === "error" ? status : "warning",
          currentTheme,
        });
        const statusMessage = getVoucherCodeStatusLabel(rowData?.isActive, intl);

        return tagsCell(
          [
            {
              tag: statusMessage,
              color: color.base,
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
