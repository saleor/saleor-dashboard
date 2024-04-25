import { DashboardCard } from "@dashboard/components/Card";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { DatagridChangeStateContext } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { OrderDetailsFragment } from "@dashboard/graphql";
import { orderTransactionRefundEditUrl } from "@dashboard/orders/urls";
import { ListViews } from "@dashboard/types";
import { Box, Button, EditIcon, PlusIcon, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { createGetCellContent, useDatagridOpts, useOrderRefundStaticColumns } from "./datagrid";
import { refundGridMessages } from "./messages";
import { manualRefundsExtractor, mergeRefunds } from "./refunds";
import {
  canAddRefund,
  getNotEditabledRefundMessage,
  isRefundEditable,
} from "./utils";

interface OrderRefundDatagridProps {
  orderId: string;
  order: OrderDetailsFragment;
  onRefundAdd: () => void;
}

export const OrderRefundDatagrid: React.FC<OrderRefundDatagridProps> = ({
  orderId,
  order,
  onRefundAdd,
}) => {
  const intl = useIntl();
  const { datagrid, currentTheme, settings, handleColumnChange } = useDatagridOpts(
    ListViews.ORDER_REFUNDS,
  );
  const orderDraftDetailsStaticColumns = useOrderRefundStaticColumns();

  const { handlers, visibleColumns, staticColumns, selectedColumns, recentlyAddedColumn } =
    useColumns({
      staticColumns: orderDraftDetailsStaticColumns,
      selectedColumns: settings?.columns ?? [],
      onSave: handleColumnChange,
    });

  const mergedRefunds = mergeRefunds(order?.grantedRefunds, manualRefundsExtractor(order, intl));

  const getCellContent = createGetCellContent({
    columns: visibleColumns,
    refunds: mergedRefunds,
    currentTheme,
    intl,
  });

  const getMenuItems = React.useCallback(index => {
    const refund = (mergedRefunds ?? [])[index];
    const isEditable = isRefundEditable(refund);

    return [
      {
        label: "",
        Icon: isEditable ? (
          <Link to={orderTransactionRefundEditUrl(orderId, (mergedRefunds ?? [])[index]?.id)}>
            <EditIcon />
          </Link>
        ) : (
          <Tooltip>
            <Tooltip.Trigger>
              <EditIcon color="defaultDisabled" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Arrow />
              <FormattedMessage {...getNotEditabledRefundMessage(refund)} />
            </Tooltip.Content>
          </Tooltip>
        ),
        onSelect: () => false,
      },
    ];
  }, []);

  const isRefundPossible = canAddRefund({
    transactions: order?.transactions,
    intl,
  });

  return (
    <DashboardCard>
      <Box paddingX={6} paddingTop={6} display="flex" justifyContent="space-between">
        <Text size={5} fontWeight="bold">
          <FormattedMessage {...refundGridMessages.refundSection} />
        </Text>
        <Tooltip>
          <Tooltip.Trigger>
            <Button
              variant="secondary"
              onClick={onRefundAdd}
              disabled={!isRefundPossible.canRefund}
            >
              <PlusIcon />
              <FormattedMessage {...refundGridMessages.addNewRefund} />
            </Button>
          </Tooltip.Trigger>
          {!isRefundPossible.canRefund && (
            <Tooltip.Content>
              <Tooltip.Arrow />
              {isRefundPossible.reason}
            </Tooltip.Content>
          )}
        </Tooltip>
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
          rows={mergedRefunds?.length ?? 0}
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
