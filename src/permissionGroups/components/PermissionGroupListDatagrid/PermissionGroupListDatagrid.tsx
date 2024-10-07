import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { PermissionGroupFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import {
  permissionGroupDetailsUrl,
  PermissionGroupListUrlSortField,
} from "@dashboard/permissionGroups/urls";
import { canBeSorted } from "@dashboard/permissionGroups/views/PermissionGroupList/sort";
import { ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { createGetCellContent, permissionGroupsListStaticColumnsAdapter } from "./datagrid";
import { messages } from "./messages";

interface PermissionGroupListDatagridProps
  extends ListProps,
    SortPage<PermissionGroupListUrlSortField> {
  permissionGroups: PermissionGroupFragment[];
}

export const PermissionGroupListDatagrid = ({
  disabled,
  onSort,
  permissionGroups,
  sort,
  settings,
  onUpdateListSettings,
}: PermissionGroupListDatagridProps) => {
  const intl = useIntl();
  const location = useLocation();
  const datagridState = useDatagridChangeState();
  const navigate = useNavigator();
  const emptyColumn = useEmptyColumn();
  const permissionGroupsListStaticColumns = useMemo(
    () => permissionGroupsListStaticColumnsAdapter(intl, sort, emptyColumn),
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
  const { handlers, visibleColumns, recentlyAddedColumn } = useColumns({
    selectedColumns: settings?.columns ?? [],
    staticColumns: permissionGroupsListStaticColumns,
    onSave: onColumnChange,
  });
  const getCellContent = useCallback(
    createGetCellContent({
      permissionGroups,
      columns: visibleColumns,
    }),
    [permissionGroups, intl, visibleColumns],
  );
  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      const rowData: PermissionGroupFragment = permissionGroups[row];

      if (rowData) {
        navigate(permissionGroupDetailsUrl(rowData.id), {
          state: {
            prevLocation: location,
          },
        });
      }
    },
    [permissionGroups],
  );
  const handleRowAnchor = useCallback(
    ([, row]: Item) => permissionGroupDetailsUrl(permissionGroups[row].id),
    [permissionGroups],
  );
  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as PermissionGroupListUrlSortField;

      if (canBeSorted(columnName)) {
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
        rowMarkers="none"
        columnSelect="single"
        hasRowHover={true}
        freezeColumns={2}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={false}
        rows={permissionGroups?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        getCellContent={getCellContent}
        getCellError={() => false}
        selectionActions={() => null}
        menuItems={() => []}
        onRowClick={handleRowClick}
        onHeaderClicked={handleHeaderClick}
        rowAnchor={handleRowAnchor}
        recentlyAddedColumn={recentlyAddedColumn}
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
