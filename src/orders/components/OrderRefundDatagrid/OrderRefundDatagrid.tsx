import { DashboardCard } from "@dashboard/components/Card";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { OrderDetailsFragment } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { orderGrantRefundEditUrl } from "@dashboard/orders/urls";
import { ListViews } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box, Button, PlusIcon, Text, useTheme } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import {
  createGetCellContent,
  orderRefundStaticColumnsAdapter,
} from "./datagrid";

interface OrderRefundDatagridProps {
  grantedRefunds: OrderDetailsFragment["grantedRefunds"];
  orderId: string;
}

export const OrderRefundDatagrid: React.FC<OrderRefundDatagridProps> = ({
  grantedRefunds,
  orderId,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const datagrid = useDatagridChangeState();

  const { updateListSettings, settings } = useListSettings(
    ListViews.ORDER_DRAFT_DETAILS_LIST,
  );

  const emptyColumn = useEmptyColumn();

  const orderDraftDetailsStaticColumns = React.useMemo(
    () => orderRefundStaticColumnsAdapter(emptyColumn, intl),
    [emptyColumn, intl],
  );

  const handleColumnChange = React.useCallback(
    picked => {
      if (updateListSettings) {
        updateListSettings("columns", picked.filter(Boolean));
      }
    },
    [updateListSettings],
  );

  const {
    handlers,
    visibleColumns,
    staticColumns,
    selectedColumns,
    recentlyAddedColumn,
  } = useColumns({
    staticColumns: orderDraftDetailsStaticColumns,
    selectedColumns: settings?.columns ?? [],
    onSave: handleColumnChange,
  });
  const { theme: currentTheme } = useTheme();

  const getCellContent = createGetCellContent({
    columns: visibleColumns,
    refunds: grantedRefunds,
    currentTheme,
  });

  const handleRowClick = React.useCallback(
    ([_, row]: Item) => {
      if (!grantedRefunds) {
        return;
      }
      const rowData = grantedRefunds[row];
      navigate(orderGrantRefundEditUrl(orderId, rowData.id));
    },
    [grantedRefunds],
  );

  return (
    <DashboardCard>
      <Box
        paddingX={6}
        paddingTop={6}
        display="flex"
        justifyContent="space-between"
      >
        <Text variant="heading">Refunds</Text>
        {/** TODO: Add modal */}
        <Button variant="secondary">
          <PlusIcon />
          Add new refund
        </Button>
      </Box>
      <DatagridChangeStateContext.Provider value={datagrid}>
        <Datagrid
          readonly
          hasRowHover
          onRowClick={handleRowClick}
          rowMarkers="none"
          columnSelect="none"
          freezeColumns={2}
          menuItems={() => []}
          verticalBorder={col => col > 1}
          availableColumns={visibleColumns}
          emptyText={""}
          getCellContent={getCellContent}
          getCellError={() => false}
          rows={grantedRefunds.length}
          selectionActions={() => null}
          onColumnResize={handlers.onResize}
          onColumnMoved={handlers.onMove}
          recentlyAddedColumn={recentlyAddedColumn}
          renderColumnPicker={() => (
            <ColumnPicker
              selectedColumns={selectedColumns}
              staticColumns={staticColumns}
              onToggle={handlers.onToggle}
            />
          )}
        />
      </DatagridChangeStateContext.Provider>
    </DashboardCard>
  );
};
