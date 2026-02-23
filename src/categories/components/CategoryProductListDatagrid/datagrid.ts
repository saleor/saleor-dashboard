import { readonlyTextCell, thumbnailCell } from "@dashboard/components/Datagrid/customCells/cells";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type CategoryDetailsQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const getColumns = (intl: IntlShape): AvailableColumn[] => [
  {
    id: "name",
    title: intl.formatMessage(columnsMessages.name),
    width: 500,
  },
];

export const createGetCellContent =
  (
    products: RelayToFlat<NonNullable<CategoryDetailsQuery["category"]>["products"]>,
    columns: AvailableColumn[],
  ) =>
  ([column, row]: Item): GridCell => {
    const columnId = columns[column]?.id;

    if (!columnId) {
      return readonlyTextCell("");
    }

    const rowData = products![row];

    switch (columnId) {
      case "name":
        return thumbnailCell(rowData?.name ?? "", rowData?.thumbnail?.url ?? "", {
          cursor: "pointer",
        });
      default:
        return readonlyTextCell("", false);
    }
  };
