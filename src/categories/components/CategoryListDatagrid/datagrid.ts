import { type CategoryListUrlSortField } from "@dashboard/categories/urls";
import { SUBCATEGORIES_PAGE_SIZE } from "@dashboard/categories/views/CategoryList/services/categoryChildrenQueries";
import { type CategoryListRow } from "@dashboard/categories/views/CategoryList/types";
import { formatIndentedTreeLabel } from "@dashboard/categories/views/CategoryList/utils/treeIndent";
import {
  chevronCell,
  loadingCell,
  loadMoreTextCell,
  readonlyTextCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type CategoryFragment } from "@dashboard/graphql";
import { type Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { type GridCell, type Item, type Theme } from "@glideapps/glide-data-grid";
import { type IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

interface CreateGetCellContentOptions {
  isCategoryExpanded?: (categoryId: string) => boolean;
  isCategoryChildrenLoading?: (categoryId: string) => boolean;
  isLoadingMoreSubcategories?: (parentId: string) => boolean;
  getCategoryDepth?: (categoryId: string) => number;
  formatLoadMoreLabel?: (remainingCount: number) => string;
  loadMoreCellThemeOverride?: Partial<Theme>;
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

const getLoadMoreCount = (remainingCount: number): number =>
  Math.min(SUBCATEGORIES_PAGE_SIZE, remainingCount);

export const createGetCellContent =
  (
    rows: CategoryListRow[],
    columns: AvailableColumn[],
    {
      isCategoryExpanded,
      isCategoryChildrenLoading,
      isLoadingMoreSubcategories,
      getCategoryDepth,
      formatLoadMoreLabel,
      loadMoreCellThemeOverride,
    }: CreateGetCellContentOptions = {},
  ) =>
  ([column, row]: Item): GridCell => {
    const columnId = columns[column]?.id;
    const rowData = rows[row];

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    if (rowData.type === "load-more") {
      const isLoadingMore = isLoadingMoreSubcategories?.(rowData.parentId) ?? false;

      switch (columnId) {
        case "expand":
          if (isLoadingMore) {
            return loadingCell();
          }

          return readonlyTextCell("", false);
        case "name":
          return loadMoreTextCell(
            formatIndentedTreeLabel(
              formatLoadMoreLabel?.(getLoadMoreCount(rowData.remainingCount)) ?? "",
              rowData.depth,
            ),
            loadMoreCellThemeOverride,
            { loading: isLoadingMore },
          );
        default:
          return readonlyTextCell("", false);
      }
    }

    const categoryRow: CategoryFragment = rowData.category;

    switch (columnId) {
      case "expand": {
        const subcategoriesCount = categoryRow.children?.totalCount ?? 0;

        if (!subcategoriesCount) {
          return readonlyTextCell("", false);
        }

        if (isCategoryChildrenLoading?.(categoryRow.id)) {
          return loadingCell();
        }

        const isExpanded = isCategoryExpanded?.(categoryRow.id) ?? false;

        return chevronCell(isExpanded);
      }
      case "name": {
        const depth = getCategoryDepth?.(categoryRow.id) ?? rowData.depth;

        return readonlyTextCell(formatIndentedTreeLabel(categoryRow.name ?? "", depth));
      }
      case "subcategories":
        return readonlyTextCell(categoryRow?.children?.totalCount?.toString() ?? "");
      case "products":
        return readonlyTextCell(categoryRow?.products?.totalCount?.toString() ?? "");
      default:
        return readonlyTextCell("", false);
    }
  };
