import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import useNavigator from "@dashboard/hooks/useNavigator";
import { StaffMember, StaffMembers } from "@dashboard/staff/types";
import { StaffListUrlSortField, staffMemberDetailsUrl } from "@dashboard/staff/urls";
import { ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { createGetCellContent, staffMembersListStaticColumnsAdapter } from "./datagrid";
import { messages } from "./messages";

interface StaffListDatagridProps extends ListProps, SortPage<StaffListUrlSortField> {
  staffMembers: StaffMembers;
}

export const StaffListDatagrid = ({
  staffMembers,
  settings,
  sort,
  disabled,
  onSort,
  onUpdateListSettings,
}: StaffListDatagridProps) => {
  const datagridState = useDatagridChangeState();
  const navigate = useNavigator();
  const location = useLocation();
  const intl = useIntl();
  const { theme: currentTheme } = useTheme();
  const emptyColumn = useEmptyColumn();
  const staffMembersListStaticColumns = useMemo(
    () => staffMembersListStaticColumnsAdapter(intl, sort, emptyColumn),
    [intl, sort, emptyColumn],
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
    staticColumns: staffMembersListStaticColumns,
    onSave: onColumnChange,
  });
  const getCellContent = useCallback(
    createGetCellContent({
      staffMembers,
      columns: visibleColumns,
      intl,
      currentTheme,
    }),
    [staffMembers, intl, visibleColumns],
  );
  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      const rowData: StaffMember = staffMembers[row];

      if (rowData) {
        navigate(staffMemberDetailsUrl(rowData?.id), {
          state: { prevLocation: location },
        });
      }
    },
    [staffMembers],
  );
  const handleRowAnchor = useCallback(
    ([, row]: Item) => staffMemberDetailsUrl(staffMembers[row]?.id),
    [staffMembers],
  );
  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as StaffListUrlSortField;

      if (Object.values(StaffListUrlSortField).includes(columnName)) {
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
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={false}
        rows={staffMembers?.length ?? 0}
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
