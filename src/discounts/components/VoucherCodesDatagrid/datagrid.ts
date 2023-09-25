import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import { readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { VoucherCodeFragment } from "@dashboard/graphql";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const voucherCodesStaticColumnsAdapter = (intl: IntlShape) => [
  {
    id: "code",
    title: intl.formatMessage(columnsMessages.code),
    width: 300,
  },
  {
    id: "usage",
    title: intl.formatMessage(columnsMessages.usage),
    width: 150,
  },
  {
    id: "limit",
    title: intl.formatMessage(columnsMessages.limit),
    width: 150,
  },
];

export const createGetCellContent =
  (voucherCodes: VoucherCodeFragment[], columns: AvailableColumn[]) =>
  ([column, row]: Item): GridCell => {
    const columnId = columns[column]?.id;
    const rowData: VoucherCodeFragment | undefined = voucherCodes[row];

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
      case "limit":
        return readonlyTextCell(
          rowData?.usageLimit?.toString() ?? PLACEHOLDER,
          false,
        );
      default:
        return readonlyTextCell("", false);
    }
  };
