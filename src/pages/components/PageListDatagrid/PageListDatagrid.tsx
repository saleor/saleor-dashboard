import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { Page, Pages } from "@dashboard/pages/types";
import { PageListUrlSortField } from "@dashboard/pages/urls";
import { ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { createGetCellContent, pageListStaticColumnsAdapter } from "./datagrid";
import { messages } from "./messages";

interface PageListDatagridProps extends ListProps, SortPage<PageListUrlSortField> {
  pages: Pages | undefined;
  loading: boolean;
  hasRowHover?: boolean;
  onSelectPageIds: (rowsIndex: number[], clearSelection: () => void) => void;
  onRowClick: (id: string) => void;
  rowAnchor?: (id: string) => string;
}

export const PageListDatagrid = ({
  pages,
  sort,
  loading,
  settings,
  onUpdateListSettings,
  hasRowHover,
  onRowClick,
  rowAnchor,
  onSelectPageIds,
  onSort,
}: PageListDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();
  const pageListStaticColumns = useMemo(
    () => pageListStaticColumnsAdapter(intl, sort),
    [intl, sort],
  );
  const onColumnChange = useCallback(
    (picked: string[]) => {
      if (onUpdateListSettings) {
        onUpdateListSettings("columns", picked.filter(Boolean));
      }
    },
    [onUpdateListSettings],
  );
  const { handlers, visibleColumns, staticColumns, selectedColumns, recentlyAddedColumn } =
    useColumns({
      gridName: "page_list",
      staticColumns: pageListStaticColumns,
      selectedColumns: settings?.columns ?? [],
      onSave: onColumnChange,
    });
  const { theme: currentTheme } = useTheme();
  const getCellContent = useCallback(
    createGetCellContent({
      pages,
      columns: visibleColumns,
      intl,
      currentTheme,
    }),
    [pages, visibleColumns],
  );
  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!onRowClick || !pages) {
        return;
      }

      const rowData: Page = pages[row];

      onRowClick(rowData.id);
    },
    [onRowClick, pages],
  );
  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      if (!rowAnchor || !pages) {
        return "";
      }

      const rowData: Page = pages[row];

      return rowAnchor(rowData.id);
    },
    [rowAnchor, pages],
  );
  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as PageListUrlSortField;

      onSort(columnName);
    },
    [visibleColumns, onSort],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        readonly
        loading={loading}
        rowMarkers="checkbox-visible"
        columnSelect="single"
        hasRowHover={hasRowHover}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={false}
        rows={pages?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        onRowSelectionChange={onSelectPageIds}
        getCellContent={getCellContent}
        getCellError={() => false}
        selectionActions={() => null}
        menuItems={() => []}
        onRowClick={handleRowClick}
        onHeaderClicked={handleHeaderClick}
        rowAnchor={handleRowAnchor}
        recentlyAddedColumn={recentlyAddedColumn}
        renderColumnPicker={() => (
          <ColumnPicker
            staticColumns={staticColumns}
            selectedColumns={selectedColumns}
            onToggle={handlers.onToggle}
          />
        )}
      />

      <Box paddingX={6}>
        <TablePaginationWithContext
          component="div"
          settings={settings}
          disabled={loading}
          onUpdateListSettings={onUpdateListSettings}
        />
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
