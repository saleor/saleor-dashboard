import { CategoryListUrlSortField } from "@dashboard/categories/urls";
import { readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { CategoryFragment } from "@dashboard/graphql";
import { getDatagridRowDataIndex } from "@dashboard/misc";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

export const getColumns = (
  intl: IntlShape,
  sort: Sort<CategoryListUrlSortField>,
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
  (
    [column, row]: Item,
    { changes, getChangeIndex, added, removed }: GetCellContentOpts,
  ): GridCell => {
    const columnId = columns[column]?.id;

    if (!columnId) {
      return readonlyTextCell("");
    }

    const change = changes.current[getChangeIndex(columnId, row)]?.data;
    const rowData = added.includes(row)
      ? undefined
      : categories[getDatagridRowDataIndex(row, removed)];

    switch (columnId) {
      case "name":
        return readonlyTextCell(change ?? rowData?.name ?? "");
      case "subcategories":
        return readonlyTextCell(
          change ?? "" + rowData?.children?.totalCount ?? "",
        );
      case "products":
        return readonlyTextCell(
          change ?? "" + rowData?.products?.totalCount ?? "",
        );
      default:
        return readonlyTextCell("", false);
    }
  };
