import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
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
  /** Search string applied to the list (URL param), used for a clearer empty state */
  searchQuery?: string;
  loading: boolean;
  hasRowHover?: boolean;
  onSelectPageIds: (rowsIndex: number[], clearSelection: () => void) => void;
  onRowClick: (id: string) => void;
  rowAnchor?: (id: string) => string;
}

export const PageListDatagrid = ({
  pages,
  searchQuery = "",
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

  const trimmedSearch = searchQuery.trim();
  const emptyText =
    trimmedSearch !== ""
      ? intl.formatMessage(messages.emptyWithSearch, { query: trimmedSearch })
      : intl.formatMessage(messages.empty);

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        readonly
        loading={loading}
        rowMarkers="checkbox-visible"
        // Push the checkbox right so the row marker column aligns with the page's
        // inset content area (title, tabs, search) above. Default is 48; +24px = 72
        // matches the surrounding `paddingX={6}` content gutter.
        rowMarkerWidth={72}
        columnSelect="single"
        hasRowHover={hasRowHover}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={false}
        rows={pages?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={emptyText}
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
