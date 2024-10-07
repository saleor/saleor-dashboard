import { CategoryListUrlSortField, categoryUrl } from "@dashboard/categories/urls";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { CategoryFragment } from "@dashboard/graphql";
import { PageListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { ReactNode, useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { categoryListStaticColumnsAdapter, createGetCellContent } from "./datagrid";
import { messages } from "./messages";

interface CategoryListDatagridProps
  extends PageListProps,
    Partial<SortPage<CategoryListUrlSortField>> {
  categories: CategoryFragment[];
  onSelectCategoriesIds: (ids: number[], clearSelection: () => void) => void;
  selectionActionButton?: ReactNode | null;
  hasRowHover?: boolean;
}

export const CategoryListDatagrid = ({
  sort,
  onSort,
  categories,
  disabled,
  onSelectCategoriesIds,
  settings,
  onUpdateListSettings,
  selectionActionButton = null,
  hasRowHover = true,
}: CategoryListDatagridProps) => {
  const location = useLocation();
  const datagridState = useDatagridChangeState();
  const intl = useIntl();
  const memoizedStaticColumns = useMemo(
    () => categoryListStaticColumnsAdapter(intl, sort),
    [intl, sort],
  );
  const handleColumnChange = useCallback(
    picked => {
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
  const getCellContent = useCallback(createGetCellContent(categories, visibleColumns), [
    categories,
    visibleColumns,
  ]);
  const handleHeaderClick = useCallback(
    (col: number) => {
      if (sort !== undefined && onSort) {
        onSort(visibleColumns[col].id as CategoryListUrlSortField);
      }
    },
    [visibleColumns, onSort, sort],
  );
  const handleRowAnchor = useCallback(
    ([, row]: Item) => categoryUrl(categories[row].id),
    [categories],
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
        availableColumns={visibleColumns}
        rows={categories?.length ?? 0}
        getCellContent={getCellContent}
        getCellError={() => false}
        emptyText={intl.formatMessage(messages.noData)}
        onHeaderClicked={handleHeaderClick}
        rowAnchor={handleRowAnchor}
        menuItems={() => []}
        actionButtonPosition="right"
        selectionActions={() => selectionActionButton}
        onColumnResize={handlers.onResize}
        onColumnMoved={handlers.onMove}
        onRowSelectionChange={onSelectCategoriesIds}
        renderColumnPicker={() => (
          <ColumnPicker
            onToggle={handlers.onToggle}
            selectedColumns={selectedColumns}
            staticColumns={staticColumns}
          />
        )}
        navigatorOpts={{
          state: {
            prevLocation: location,
          },
        }}
      />

      <Box paddingX={6}>
        <TablePaginationWithContext
          component="div"
          colSpan={1}
          settings={settings}
          disabled={disabled}
          onUpdateListSettings={onUpdateListSettings}
        />
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
