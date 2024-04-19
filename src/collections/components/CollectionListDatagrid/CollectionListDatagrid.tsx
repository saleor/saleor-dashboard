import { Collection, Collections } from "@dashboard/collections/types";
import { CollectionListUrlSortField } from "@dashboard/collections/urls";
import { canBeSorted } from "@dashboard/collections/views/CollectionList/sort";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { commonTooltipMessages } from "@dashboard/components/TooltipTableCellHeader/messages";
import { ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { collectionListStaticColumnsAdapter, createGetCellContent } from "./datagrid";
import { messages } from "./messages";

interface CollectionListDatagridProps extends ListProps, SortPage<CollectionListUrlSortField> {
  collections: Collections;
  loading: boolean;
  selectedChannelId: string;
  hasRowHover?: boolean;
  onSelectCollectionIds: (rowsIndex: number[], clearSelection: () => void) => void;
  onRowClick: (id: string) => void;
  rowAnchor?: (id: string) => string;
}

export const CollectionListDatagrid = ({
  collections,
  sort,
  loading,
  settings,
  onUpdateListSettings,
  hasRowHover,
  onRowClick,
  rowAnchor,
  disabled,
  onSelectCollectionIds,
  onSort,
  filterDependency,
  selectedChannelId,
}: CollectionListDatagridProps) => {
  const intl = useIntl();
  const { theme: currentTheme } = useTheme();
  const datagrid = useDatagridChangeState();
  const collectionListStaticColumns = useMemo(
    () => collectionListStaticColumnsAdapter(intl, sort),
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
      staticColumns: collectionListStaticColumns,
      selectedColumns: settings?.columns ?? [],
      onSave: onColumnChange,
    });
  const getCellContent = useCallback(
    createGetCellContent({
      collections,
      intl,
      columns: visibleColumns,
      selectedChannelId,
      currentTheme,
    }),
    [collections, intl, visibleColumns, selectedChannelId, currentTheme],
  );
  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!onRowClick) {
        return;
      }

      const rowData: Collection = collections[row];

      onRowClick(rowData.id);
    },
    [onRowClick, collections],
  );
  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      if (!rowAnchor) {
        return "";
      }

      const rowData: Collection = collections[row];

      return rowAnchor(rowData.id);
    },
    [rowAnchor, collections],
  );
  const handleGetColumnTooltipContent = useCallback(
    (col: number): string => {
      const columnName = visibleColumns[col].id as CollectionListUrlSortField;

      if (canBeSorted(columnName, !!selectedChannelId)) {
        return "";
      }

      // Sortable but requrie selected channel
      return intl.formatMessage(commonTooltipMessages.noFilterSelected, {
        filterName: filterDependency?.label ?? "",
      });
    },
    [filterDependency, intl, selectedChannelId, visibleColumns],
  );
  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as CollectionListUrlSortField;

      if (canBeSorted(columnName, !!selectedChannelId)) {
        onSort(columnName);
      }
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
        verticalBorder={col => col > 0}
        rows={collections?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        onRowSelectionChange={onSelectCollectionIds}
        getCellContent={getCellContent}
        getCellError={() => false}
        selectionActions={() => null}
        menuItems={() => []}
        onRowClick={handleRowClick}
        onHeaderClicked={handleHeaderClick}
        rowAnchor={handleRowAnchor}
        getColumnTooltipContent={handleGetColumnTooltipContent}
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
          disabled={disabled}
          onUpdateListSettings={onUpdateListSettings}
        />
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
