import { type CategoryListUrlSortField } from "@dashboard/categories/urls";
import {
  chevronCell,
  loadingCell,
  readonlyTextCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type CategoryFragment } from "@dashboard/graphql";
import { type Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

interface CreateGetCellContentOptions {
  isCategoryExpanded?: (categoryId: string) => boolean;
  isCategoryChildrenLoading?: (categoryId: string) => boolean;
  getCategoryDepth?: (categoryId: string) => number;
}

export const categoryListExpandColumn: AvailableColumn = {
  id: "expand",
  title: "",
  width: 20,
  action: () => true,
};

export const categoryListStaticColumnsAdapter = (
  intl: IntlShape,
  sort?: Sort<CategoryListUrlSortField>,
): AvailableColumn[] =>
  [
    {
      id: "name",
      title: intl.formatMessage(columnsMessages.categoryName),
      width: 350,
    },
    {
      id: "subcategories",
      title: intl.formatMessage(columnsMessages.subcategories),
      width: 300,
    },
    {
      id: "products",
      title: intl.formatMessage(columnsMessages.numberOfProducts),
      width: 300,
    },
  ].map(column => ({
    ...column,
    icon: sort ? getColumnSortDirectionIcon(sort, column.id) : undefined,
  }));

const getIndentedName = (name: string, depth: number): string =>
  `${"\u00A0".repeat(depth * 4)}${name}`;

export const createGetCellContent =
  (
    categories: CategoryFragment[],
    columns: AvailableColumn[],
    {
      isCategoryExpanded,
      isCategoryChildrenLoading,
      getCategoryDepth,
    }: CreateGetCellContentOptions = {},
  ) =>
  ([column, row]: Item): GridCell => {
    const columnId = columns[column]?.id;
    const rowData: CategoryFragment | undefined = categories[row];

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "expand": {
        const subcategoriesCount = rowData.children?.totalCount ?? 0;

        if (!subcategoriesCount) {
          return readonlyTextCell("", false);
        }

        if (isCategoryChildrenLoading?.(rowData.id)) {
          return loadingCell();
        }

        const isExpanded = isCategoryExpanded?.(rowData.id) ?? false;

        return chevronCell(isExpanded);
      }
      case "name":
        const depth = getCategoryDepth?.(rowData.id) ?? 0;

        return readonlyTextCell(getIndentedName(rowData.name ?? "", depth));
      case "subcategories":
        return readonlyTextCell(rowData?.children?.totalCount?.toString() ?? "");
      case "products":
        return readonlyTextCell(rowData?.products?.totalCount?.toString() ?? "");
      default:
        return readonlyTextCell("", false);
    }
  };
