// @ts-strict-ignore
import { CollectionListUrlSortField } from "@dashboard/collections/urls";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { CollectionListQuery } from "@dashboard/graphql";
import { ListProps, RelayToFlat, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui/next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import {
  collectionListStaticColumnsAdapter,
  createGetCellContent,
} from "./datagrid";
import { messages } from "./messages";

interface CollectionListDatagridProps
  extends ListProps,
    SortPage<CollectionListUrlSortField> {
  collections: RelayToFlat<CollectionListQuery["collections"]>;
  loading: boolean;
  columnPickerSettings: string[];
  selectedChannelId: string;
  hasRowHover?: boolean;
  onSelectCollectionIds: (
    rowsIndex: number[],
    clearSelection: () => void,
  ) => void;
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
  columnPickerSettings,
  onSelectCollectionIds,
  onSort,
}: CollectionListDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();
  const collectionListStaticColumns = useMemo(
    () => collectionListStaticColumnsAdapter(intl, sort),
    [intl, sort],
  );

  const handleColumnChange = useCallback(
    (picked: string[]) => {
      onUpdateListSettings("columns", picked.filter(Boolean));
    },
    [onUpdateListSettings],
  );

  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!onRowClick) {
        return;
      }
      const rowData = collections[row];
      onRowClick(rowData.id);
    },
    [onRowClick, collections],
  );

  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      if (!rowAnchor) {
        return;
      }
      const rowData = collections[row];
      return rowAnchor(rowData.id);
    },
    [rowAnchor, collections],
  );

  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = collectionListStaticColumns[col]
        .id as CollectionListUrlSortField;
      if (columnName !== CollectionListUrlSortField.available) {
        onSort(columnName);
      }
    },
    [collectionListStaticColumns, onSort],
  );

  const {
    handlers,
    visibleColumns,
    staticColumns,
    dynamicColumns,
    selectedColumns,
    columnCategories,
    recentlyAddedColumn,
  } = useColumns({
    staticColumns: collectionListStaticColumns,
    selectedColumns: settings.columns,
    onSave: handleColumnChange,
  });

  const getCellContent = useCallback(
    createGetCellContent({
      collections,
      intl,
      columns: visibleColumns,
    }),
    [collections, intl, visibleColumns],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        readonly
        loading={loading}
        rowMarkers="checkbox"
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
        recentlyAddedColumn={recentlyAddedColumn}
        renderColumnPicker={() => (
          <ColumnPicker
            staticColumns={staticColumns}
            dynamicColumns={dynamicColumns}
            selectedColumns={selectedColumns}
            columnCategories={columnCategories}
            onDynamicColumnSelect={handlers.onDynamicColumnSelect}
            columnPickerSettings={columnPickerSettings}
            onSave={handlers.onChange}
          />
        )}
      />

      <Box paddingX={6}>
        <TablePaginationWithContext
          component="div"
          colSpan={
            (collections?.length === 0 ? 1 : 2) + settings.columns.length
          }
          settings={settings}
          disabled={disabled}
          onUpdateListSettings={onUpdateListSettings}
        />
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
