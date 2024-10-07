import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { commonTooltipMessages } from "@dashboard/components/TooltipTableCellHeader/messages";
import { VoucherListUrlSortField, voucherUrl } from "@dashboard/discounts/urls";
import { canBeSorted } from "@dashboard/discounts/views/VoucherList/sort";
import { VoucherFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import useNavigator from "@dashboard/hooks/useNavigator";
import { ChannelProps, ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { createGetCellContent, vouchersListStaticColumnsAdapter } from "./datagrid";
import { messages } from "./messages";

interface VoucherListDatagridProps
  extends ListProps,
    SortPage<VoucherListUrlSortField>,
    ChannelProps {
  vouchers: VoucherFragment[];
  onSelectVouchersIds: (rowsIndex: number[], clearSelection: () => void) => void;
}

export const VoucherListDatagrid = ({
  vouchers,
  settings,
  sort,
  selectedChannelId,
  disabled,
  filterDependency,
  onSort,
  onSelectVouchersIds,
  onUpdateListSettings,
}: VoucherListDatagridProps) => {
  const datagridState = useDatagridChangeState();
  const location = useLocation();
  const navigate = useNavigator();
  const { locale } = useLocale();
  const intl = useIntl();
  const vouchersListStaticColumns = useMemo(
    () => vouchersListStaticColumnsAdapter(intl, sort),
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
  const { handlers, visibleColumns, recentlyAddedColumn, staticColumns, selectedColumns } =
    useColumns({
      gridName: "voucher_list",
      selectedColumns: settings?.columns ?? [],
      staticColumns: vouchersListStaticColumns,
      onSave: onColumnChange,
    });
  const getCellContent = useCallback(
    createGetCellContent({
      vouchers,
      columns: visibleColumns,
      locale,
      selectedChannelId,
    }),
    [vouchers, selectedChannelId, locale, visibleColumns],
  );
  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      const rowData: VoucherFragment = vouchers[row];

      if (rowData) {
        navigate(voucherUrl(rowData.id), {
          state: {
            prevLocation: location,
          },
        });
      }
    },
    [vouchers],
  );
  const handleRowAnchor = useCallback(([, row]: Item) => voucherUrl(vouchers[row].id), [vouchers]);
  const handleGetColumnTooltipContent = useCallback(
    (col: number): string => {
      const columnName = visibleColumns[col].id as VoucherListUrlSortField;

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
      const columnName = visibleColumns[col].id as VoucherListUrlSortField;

      if (canBeSorted(columnName, !!selectedChannelId)) {
        onSort(columnName);
      }
    },
    [visibleColumns, onSort],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagridState}>
      <Datagrid
        readonly
        loading={disabled}
        rowMarkers="checkbox-visible"
        columnSelect="single"
        hasRowHover={true}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={false}
        rows={vouchers?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        onRowSelectionChange={onSelectVouchersIds}
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
