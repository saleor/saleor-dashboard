import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import {
  dateCell,
  readonlyTextCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { DiscountListUrlSortField } from "@dashboard/discounts/discountsUrls";
import { PromotionFragment } from "@dashboard/graphql";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const dicountListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort<DiscountListUrlSortField>,
  emptyColumn: AvailableColumn,
) =>
  [
    emptyColumn,
    {
      id: "name",
      title: intl.formatMessage(columnsMessages.name),
      width: 350,
    },
    {
      id: "startDate",
      title: intl.formatMessage(columnsMessages.starts),
      width: 200,
    },
    {
      id: "endDate",
      title: intl.formatMessage(columnsMessages.ends),
      width: 200,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const createGetCellContent =
  ({
    promotions,
    columns,
  }: {
    promotions: PromotionFragment[];
    columns: AvailableColumn[];
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData = promotions[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "name":
        return readonlyTextCell(rowData.name);
      case "startDate":
        return rowData.startDate
          ? dateCell(rowData.startDate)
          : readonlyTextCell(PLACEHOLDER);
      case "endDate":
        return rowData.endDate
          ? dateCell(rowData.endDate)
          : readonlyTextCell(PLACEHOLDER);
      default:
        return readonlyTextCell("");
    }
  };
