import { CategoryListUrlSortField, categoryUrl } from "@dashboard/categories/urls";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { DatagridPagination } from "@dashboard/components/TablePagination";
import { CategoryFragment } from "@dashboard/graphql";
import { getPrevLocationState } from "@dashboard/hooks/useBackLinkWithState";
import useNavigator from "@dashboard/hooks/useNavigator";
import { PageListProps, SortPage } from "@dashboard/types";
import { CompactSelection, GridSelection, Item } from "@glideapps/glide-data-grid";
import { ReactNode, useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import {
  categoryListExpandColumn,
  categoryListStaticColumnsAdapter,
  createGetCellContent,
} from "./datagrid";
import { messages } from "./messages";

interface CategoryListDatagridProps
  extends PageListProps,
    Partial<SortPage<CategoryListUrlSortField>> {
  categories: CategoryFragment[];
  selectedCategoriesIds?: string[];
  onSelectCategoriesIds: (ids: number[], clearSelection: () => void) => void;
  onSelectedCategoriesIdsChange?: (ids: string[]) => void;
  selectionActionButton?: ReactNode | null;
  hasRowHover?: boolean;
  isCategoryExpanded?: (categoryId: string) => boolean;
  onCategoryExpandToggle?: (categoryId: string) => void;
  isCategoryChildrenLoading?: (categoryId: string) => boolean;
  getCategoryDepth?: (categoryId: string) => number;
}

export const CategoryListDatagrid = ({
  sort,
  onSort,
  categories,
  selectedCategoriesIds = [],
  disabled,
  onSelectCategoriesIds,
  onSelectedCategoriesIdsChange,
  settings,
  onUpdateListSettings,
  selectionActionButton = null,
  hasRowHover = true,
  isCategoryExpanded,
  onCategoryExpandToggle,
  isCategoryChildrenLoading,
  getCategoryDepth,
}: CategoryListDatagridProps): JSX.Element => {
  const navigate = useNavigator();
  const location = useLocation();
  const datagridState = useDatagridChangeState();
  const intl = useIntl();
  const memoizedStaticColumns = useMemo(
    () => categoryListStaticColumnsAdapter(intl, sort),
    [intl, sort],
  );
  const isSelectionControlled = !!onSelectedCategoriesIdsChange;
  const controlledSelection = useMemo<GridSelection>(() => {
    const rowIndexByCategoryId = categories.reduce<Record<string, number>>(
      (acc, category, index) => {
        acc[category.id] = index;

        return acc;
      },
      {},
    );
    const rows = selectedCategoriesIds.reduce((selection, categoryId) => {
      const rowIndex = rowIndexByCategoryId[categoryId];

      if (rowIndex === undefined) {
        return selection;
      }

      return selection.add(rowIndex);
    }, CompactSelection.empty());

    return {
      columns: CompactSelection.empty(),
      rows,
    };
  }, [categories, selectedCategoriesIds]);
  const handleControlledSelectionChange = useCallback(
    (selection: GridSelection | undefined) => {
      if (!onSelectedCategoriesIdsChange) {
        return;
      }

      const selectedIds = (selection?.rows.toArray() ?? [])
        .map(rowIndex => categories[rowIndex]?.id)
        .filter((id): id is string => !!id);

      onSelectedCategoriesIdsChange(selectedIds);
    },
    [categories, onSelectedCategoriesIdsChange],
  );
  const handleColumnChange = useCallback(
    (picked: string[]) => {
      if (onUpdateListSettings) {
        onUpdateListSettings("columns", picked.filter(Boolean));
      }
    },
    [onUpdateListSettings],
  );
  const { handlers, selectedColumns, staticColumns, visibleColumns } = useColumns({
    gridName: "category_list",
    staticColumns: memoizedStaticColumns,
    selectedColumns: settings?.columns ?? [],
    onSave: handleColumnChange,
  });
  const shouldShowExpandColumn = Boolean(isCategoryExpanded && onCategoryExpandToggle);
  const availableColumns = useMemo(
    () => (shouldShowExpandColumn ? [categoryListExpandColumn, ...visibleColumns] : visibleColumns),
    [shouldShowExpandColumn, visibleColumns],
  );
  const getCellContent = useMemo(
    () =>
      createGetCellContent(categories, availableColumns, {
        isCategoryExpanded,
        isCategoryChildrenLoading,
        getCategoryDepth,
      }),
    [categories, availableColumns, isCategoryExpanded, isCategoryChildrenLoading, getCategoryDepth],
  );
  const handleRowAnchor = useCallback(
    ([, row]: Item) => categoryUrl(categories[row].id),
    [categories],
  );
  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnId = availableColumns[col]?.id;

      if (sort === undefined || !onSort || !columnId) {
        return;
      }

      switch (columnId) {
        case CategoryListUrlSortField.name:
        case CategoryListUrlSortField.productCount:
        case CategoryListUrlSortField.subcategoryCount:
          onSort(columnId);
          break;
      }
    },
    [availableColumns, onSort, sort],
  );
  const handleRowClick = useCallback(
    ([col, row]: Item) => {
      const rowData = categories[row];

      if (!rowData) {
        return;
      }

      const clickedColumnId = availableColumns[col]?.id;

      if (clickedColumnId === "expand") {
        const hasSubcategories = (rowData.children?.totalCount ?? 0) > 0;
        const isLoading = isCategoryChildrenLoading?.(rowData.id) ?? false;

        if (hasSubcategories && !isLoading && onCategoryExpandToggle) {
          onCategoryExpandToggle(rowData.id);
        }

        return;
      }

      navigate(categoryUrl(rowData.id));
    },
    [availableColumns, categories, navigate, onCategoryExpandToggle, isCategoryChildrenLoading],
  );
  const handleColumnMove = useCallback(
    (startIndex: number, endIndex: number) => {
      if (!shouldShowExpandColumn) {
        handlers.onMove(startIndex, endIndex);

        return;
      }

      if (startIndex === 0 || endIndex === 0) {
        return;
      }

      handlers.onMove(startIndex - 1, endIndex - 1);
    },
    [handlers, shouldShowExpandColumn],
  );
  const handleColumnResize = useCallback(
    (...args: Parameters<typeof handlers.onResize>) => {
      const [column] = args;

      if (column.id === "expand") {
        return;
      }

      handlers.onResize(...args);
    },
    [handlers],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagridState}>
      <Datagrid
        readonly
        hasRowHover={hasRowHover}
        loading={disabled}
        columnSelect={sort !== undefined ? "single" : undefined}
        verticalBorder={false}
        rowMarkers="checkbox-visible"
        availableColumns={availableColumns}
        rows={categories?.length ?? 0}
        getCellContent={getCellContent}
        getCellError={() => false}
        emptyText={intl.formatMessage(messages.noData)}
        onHeaderClicked={handleHeaderClick}
        rowAnchor={handleRowAnchor}
        menuItems={() => []}
        onRowClick={handleRowClick}
        actionButtonPosition="right"
        selectionActions={() => selectionActionButton}
        onColumnResize={handleColumnResize}
        onColumnMoved={handleColumnMove}
        onRowSelectionChange={onSelectCategoriesIds}
        controlledSelection={isSelectionControlled ? controlledSelection : undefined}
        onControlledSelectionChange={
          isSelectionControlled ? handleControlledSelectionChange : undefined
        }
        renderColumnPicker={() => (
          <ColumnPicker
            onToggle={handlers.onToggle}
            selectedColumns={selectedColumns}
            staticColumns={staticColumns}
          />
        )}
        navigatorOpts={{ state: getPrevLocationState(location) }}
      />

      <DatagridPagination
        component="div"
        colSpan={1}
        settings={settings}
        disabled={disabled}
        onUpdateListSettings={onUpdateListSettings}
      />
    </DatagridChangeStateContext.Provider>
  );
};
