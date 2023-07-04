// @ts-strict-ignore
import { CategoryListUrlSortField } from "@dashboard/categories/urls";
import { readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { CategoryFragment } from "@dashboard/graphql";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const getColumns = (
  intl: IntlShape,
  sort?: Sort<CategoryListUrlSortField>,
): AvailableColumn[] => [
  {
    id: "name",
    title: intl.formatMessage(columnsMessages.categoryName),
    width: 350,
    icon: sort
      ? getColumnSortDirectionIcon(sort, CategoryListUrlSortField.name)
      : undefined,
  },
  {
    id: "subcategories",
    title: intl.formatMessage(columnsMessages.subcategories),
    width: 300,
    icon: sort
      ? getColumnSortDirectionIcon(
          sort,
          CategoryListUrlSortField.subcategoryCount,
        )
      : undefined,
  },
  {
    id: "products",
    title: intl.formatMessage(columnsMessages.numberOfProducts),
    width: 300,
    icon: sort
      ? getColumnSortDirectionIcon(sort, CategoryListUrlSortField.productCount)
      : undefined,
  },
];

export const createGetCellContent =
  (categories: CategoryFragment[], columns: AvailableColumn[]) =>
  ([column, row]: Item): GridCell => {
    const columnId = columns[column]?.id;

    if (!columnId) {
      return readonlyTextCell("");
    }

    const rowData = categories[row];

    switch (columnId) {
      case "name":
        return readonlyTextCell(rowData?.name ?? "");
      case "subcategories":
        return readonlyTextCell(rowData?.children?.totalCount.toString() ?? "");
      case "products":
        return readonlyTextCell(rowData?.products?.totalCount.toString() ?? "");
      default:
        return readonlyTextCell("", false);
    }
  };
