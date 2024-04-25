import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { commonTooltipMessages } from "@dashboard/components/TooltipTableCellHeader/messages";
import { SaleListUrlSortField, saleUrl } from "@dashboard/discounts/urls";
import { SaleFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { ChannelProps, ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { canBeSorted } from "../../views/SaleList/sort";
import { createGetCellContent, salesListStaticColumnsAdapter } from "./datagrid";
import { messages } from "./messages";

interface SaleListDatagridProps extends ListProps, SortPage<SaleListUrlSortField>, ChannelProps {
  sales: SaleFragment[];
  onSelectSaleIds: (ids: number[], clearSelection: () => void) => void;
  onRowClick: (id: string) => void;
  hasRowHover?: boolean;
}

export const SaleListDatagrid = ({
  disabled,
  onSort,
  sales,
  selectedChannelId,
  sort,
  filterDependency,
  onUpdateListSettings,
  onSelectSaleIds,
  onRowClick,
  hasRowHover = true,
  settings,
}: SaleListDatagridProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const datagrid = useDatagridChangeState();
  const collectionListStaticColumns = useMemo(
    () => salesListStaticColumnsAdapter(intl, sort),
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
      sales,
      columns: visibleColumns,
      locale,
      selectedChannelId,
    }),
    [sales, selectedChannelId, locale, visibleColumns],
  );
  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!onRowClick) {
        return;
      }

      const rowData: SaleFragment = sales[row];

      onRowClick(rowData.id);
    },
    [onRowClick, sales],
  );
  const handleRowAnchor = useCallback(([, row]: Item) => saleUrl(sales[row].id), [sales]);
  const handleGetColumnTooltipContent = useCallback(
    (col: number): string => {
      const columnName = visibleColumns[col].id as SaleListUrlSortField;

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
      const columnName = visibleColumns[col].id as SaleListUrlSortField;

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
        loading={disabled}
        rowMarkers="checkbox-visible"
        columnSelect="single"
        hasRowHover={hasRowHover}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={col => col > 0}
        rows={sales?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        onRowSelectionChange={onSelectSaleIds}
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
