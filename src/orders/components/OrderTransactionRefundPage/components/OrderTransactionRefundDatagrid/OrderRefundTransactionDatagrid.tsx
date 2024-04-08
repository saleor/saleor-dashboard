import { DashboardCard } from "@dashboard/components/Card";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeOpts,
  DatagridChangeStateContext,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import { ListViews } from "@dashboard/types";
import { Box, Button, Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { Control, Controller } from "react-hook-form";

import {
  OrderTransactionRefundPageFormData,
  QuantityToRefund,
} from "../../OrderTransactionRefundPage";
// import { useIntl } from "react-intl";
import {
  createGetCellContent,
  useDatagridOpts,
  useOrderTransactionRefundStaticColumns,
} from "./datagrid";

interface OrderTransactionRefundDatagridProps {
  order: OrderDetailsGrantRefundFragment | undefined | null;
  control: Control<OrderTransactionRefundPageFormData, any>;
  onChange: (data: DatagridChangeOpts) => void;
  onMaxQtySet: (rows: number[]) => void;
  qtyToRefund: QuantityToRefund[];
}

export const OrderTransactionRefundDatagrid: React.FC<
  OrderTransactionRefundDatagridProps
> = ({ order, control, onChange, qtyToRefund, onMaxQtySet }) => {
  // const intl = useIntl();
  const { datagrid, settings, handleColumnChange } = useDatagridOpts(
    ListViews.ORDER_TRANSACTION_REFUNDS,
  );

  const orderDraftDetailsStaticColumns =
    useOrderTransactionRefundStaticColumns();

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
    lines: order?.lines,
    qtyToRefund,
  });

  //   const getMenuItems = React.useCallback(
  //     () => [
  //       {
  //         label: "",
  //         Icon: <Text>All</Text>,
  //         onSelect: () => false,
  //       },
  //     ],
  //     [],
  //   );

  return (
    <DashboardCard>
      {order ? (
        <DatagridChangeStateContext.Provider value={datagrid}>
          <Controller
            name="qtyToRefund"
            control={control}
            render={({ field }) => (
              <Datagrid
                {...field}
                hasRowHover
                rowMarkers="checkbox-visible"
                columnSelect="none"
                freezeColumns={1}
                menuItems={() => []}
                verticalBorder={true}
                availableColumns={visibleColumns}
                emptyText={""}
                getCellContent={getCellContent}
                getCellError={() => false}
                rows={order?.lines.length ?? 0}
                selectionActions={values => (
                  // I think this is better to put above datagrid
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => onMaxQtySet(values)}
                    >
                      Set maximum qty
                    </Button>
                  </>
                )}
                onChange={onChange}
                actionButtonPosition="right"
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
            )}
          />
        </DatagridChangeStateContext.Provider>
      ) : (
        <Box display="flex">
          <Skeleton marginX={6} />
        </Box>
      )}
    </DashboardCard>
  );
};
