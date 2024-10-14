import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { Customer, Customers } from "@dashboard/customers/types";
import { CustomerListUrlSortField } from "@dashboard/customers/urls";
import { PermissionEnum } from "@dashboard/graphql";
import { ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { createGetCellContent, customerListStaticColumnsAdapter } from "./datagrid";
import { messages } from "./messages";

interface CustomerListDatagridProps extends ListProps, SortPage<CustomerListUrlSortField> {
  customers: Customers | undefined;
  loading: boolean;
  hasRowHover?: boolean;
  onSelectCustomerIds: (rowsIndex: number[], clearSelection: () => void) => void;
  onRowClick: (id: string) => void;
  rowAnchor?: (id: string) => string;
}

export const CustomerListDatagrid = ({
  customers,
  sort,
  loading,
  settings,
  onUpdateListSettings,
  hasRowHover,
  onRowClick,
  rowAnchor,
  disabled,
  onSelectCustomerIds,
  onSort,
}: CustomerListDatagridProps) => {
  const intl = useIntl();
  const location = useLocation();
  const datagrid = useDatagridChangeState();
  const userPermissions = useUserPermissions();
  const hasManageOrdersPermission =
    userPermissions?.some(perm => perm.code === PermissionEnum.MANAGE_ORDERS) ?? false;
  const customerListStaticColumns = useMemo(
    () => customerListStaticColumnsAdapter(intl, sort, hasManageOrdersPermission),
    [intl, sort, hasManageOrdersPermission],
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
      gridName: "customer_list",
      staticColumns: customerListStaticColumns,
      selectedColumns: settings?.columns ?? [],
      onSave: onColumnChange,
    });
  const getCellContent = useCallback(
    createGetCellContent({
      customers,
      columns: visibleColumns,
    }),
    [customers, visibleColumns],
  );
  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!onRowClick || !customers) {
        return;
      }

      const rowData: Customer = customers[row];

      onRowClick(rowData.id);
    },
    [onRowClick, customers],
  );
  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      if (!rowAnchor || !customers) {
        return "";
      }

      const rowData: Customer = customers[row];

      return rowAnchor(rowData.id);
    },
    [rowAnchor, customers],
  );
  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as CustomerListUrlSortField;

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
        rows={customers?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        onRowSelectionChange={onSelectCustomerIds}
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
        navigatorOpts={{
          state: {
            prevLocation: location,
          },
        }}
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
