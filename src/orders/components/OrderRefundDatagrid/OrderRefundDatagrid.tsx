import { DashboardCard } from "@dashboard/components/Card";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { DatagridChangeStateContext } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { OrderDetailsFragment } from "@dashboard/graphql";
import { orderGrantRefundEditUrl } from "@dashboard/orders/urls";
import { ListViews } from "@dashboard/types";
import { Box, Button, EditIcon, PlusIcon, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import {
  createGetCellContent,
  useDatagridOpts,
  useOrderRefundStaticColumns,
} from "./datagrid";
import { refundGridMessages } from "./messages";

interface OrderRefundDatagridProps {
  grantedRefunds: OrderDetailsFragment["grantedRefunds"];
  orderId: string;
  onRefundAdd: () => void;
}

export const OrderRefundDatagrid: React.FC<OrderRefundDatagridProps> = ({
  grantedRefunds,
  orderId,
  onRefundAdd,
}) => {
  const intl = useIntl();
  const { datagrid, currentTheme, settings, handleColumnChange } =
    useDatagridOpts(ListViews.ORDER_REFUNDS);

  const orderDraftDetailsStaticColumns = useOrderRefundStaticColumns();

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

  const getCellContent = createGetCellContent({
    columns: visibleColumns,
    refunds: grantedRefunds,
    currentTheme,
    intl,
  });

  const getMenuItems = React.useCallback(
    index => [
      {
        label: "",
        Icon: (
          <Link
            to={orderGrantRefundEditUrl(orderId, grantedRefunds[index]?.id)}
          >
            <EditIcon />
          </Link>
        ),
        onSelect: () => false,
      },
    ],
    [],
  );

  return (
    <DashboardCard>
      <Box
        paddingX={6}
        paddingTop={6}
        display="flex"
        justifyContent="space-between"
      >
        <Text size={5} fontWeight="bold">
          <FormattedMessage {...refundGridMessages.refundSection} />
        </Text>
        <Button variant="secondary" onClick={onRefundAdd}>
          <PlusIcon />
          <FormattedMessage {...refundGridMessages.addNewRefund} />
        </Button>
      </Box>
      <DatagridChangeStateContext.Provider value={datagrid}>
        <Datagrid
          readonly
          hasRowHover
          rowMarkers="none"
          columnSelect="none"
          freezeColumns={2}
          menuItems={getMenuItems}
          verticalBorder={col => col > 1}
          availableColumns={visibleColumns}
          emptyText={intl.formatMessage(refundGridMessages.noRefunds)}
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
