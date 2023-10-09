import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import { readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { GridCell, Item } from "@glideapps/glide-data-grid";
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
  (voucherCodes: VoucherCode[], columns: AvailableColumn[], intl: IntlShape) =>
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
      case "status":
        return readonlyTextCell(getStatus(rowData?.isActive, intl), false);
      default:
        return readonlyTextCell("", false);
    }
  };

function getStatus(isActive: boolean | undefined, intl: IntlShape) {
  if (isActive === undefined) {
    return intl.formatMessage(messages.draft);
  }

  return isActive
    ? intl.formatMessage(messages.active)
    : intl.formatMessage(messages.inactive);
}
