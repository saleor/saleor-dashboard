import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import { LIST_INSET_ROW_MARKER_WIDTH } from "@dashboard/components/Datagrid/const";
import { Datagrid } from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { DatagridPagination } from "@dashboard/components/TablePagination";
import { type Page, type Pages } from "@dashboard/modeling/types";
import { type PageListUrlSortField } from "@dashboard/modeling/urls";
import { type ListProps, type SortPage } from "@dashboard/types";
import { type Item } from "@glideapps/glide-data-grid";
import { useTheme } from "@saleor/macaw-ui-next";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { createGetCellContent, pageListStaticColumnsAdapter } from "./datagrid";
import { messages } from "./messages";

interface PageListDatagridProps extends ListProps, SortPage<PageListUrlSortField> {
  pages: Pages | undefined;
  loading: boolean;
  hasRowHover?: boolean;
  searchQuery?: string;
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
  searchQuery,
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
  const defaultColumns = ["title", "slug", "visible", "contentType"];
  const { handlers, visibleColumns, staticColumns, selectedColumns, recentlyAddedColumn } =
    useColumns({
      gridName: "page_list",
      staticColumns: pageListStaticColumns,
      selectedColumns: settings?.columns ?? defaultColumns,
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
        rowMarkerWidth={LIST_INSET_ROW_MARKER_WIDTH}
        columnSelect="single"
        hasRowHover={hasRowHover}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={false}
        rows={pages?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={
          searchQuery
            ? intl.formatMessage(messages.emptySearch, { query: searchQuery })
            : intl.formatMessage(messages.empty)
        }
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

      <DatagridPagination
        component="div"
        settings={settings}
        disabled={loading}
        onUpdateListSettings={onUpdateListSettings}
      />
    </DatagridChangeStateContext.Provider>
  );
};
