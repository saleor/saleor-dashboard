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
import { Item } from "@glideapps/glide-data-grid";
import { Box, Button, Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { LineToRefund, OrderTransactionRefundPageFormData } from "../../OrderTransactionRefundPage";
import {
  createGetCellContent,
  useDatagridOpts,
  useOrderTransactionRefundStaticColumns,
} from "./datagrid";
import { transactionRefundGridMessages } from "./messages";

export interface OrderRefundTransactionDatagridError {
  field: string;
  lineId: string;
}

interface OrderTransactionRefundDatagridProps {
  errors?: OrderRefundTransactionDatagridError[];
  order: OrderDetailsGrantRefundFragment | undefined | null;
  draftRefund?: OrderDetailsGrantRefundFragment["grantedRefunds"][0];
  control: Control<OrderTransactionRefundPageFormData, any>;
  onChange: (data: DatagridChangeOpts) => void;
  onMaxQtySet: (rows: number[]) => void;
  linesToRefund: LineToRefund[];
}

export const OrderTransactionRefundDatagrid: React.FC<OrderTransactionRefundDatagridProps> = ({
  order,
  draftRefund,
  control,
  onChange,
  linesToRefund,
  onMaxQtySet,
  errors,
}) => {
  const { datagrid, settings, handleColumnChange } = useDatagridOpts(
    ListViews.ORDER_TRANSACTION_REFUNDS,
  );

  const orderDraftDetailsStaticColumns = useOrderTransactionRefundStaticColumns();

  const { handlers, visibleColumns, staticColumns, selectedColumns, recentlyAddedColumn } =
    useColumns({
      staticColumns: orderDraftDetailsStaticColumns,
      selectedColumns: settings?.columns ?? [],
      onSave: handleColumnChange,
    });

  const getCellContent = createGetCellContent({
    columns: visibleColumns,
    lines: order?.lines,
    linesToRefund,
    order,
    draftRefund,
  });

  const getCellError = ([column, row]: Item) => {
    const line = order!.lines[row];
    const columnId = staticColumns[column].id;
    const error = errors?.find(err => err.lineId === line.id);

    if (error?.field === "quantity" && columnId === "qtyToRefund") {
      return true;
    }

    if (error?.field === "reason" && columnId === "reason") {
      return true;
    }

    return false;
  };

  return (
    <DashboardCard>
      {order ? (
        <DatagridChangeStateContext.Provider value={datagrid}>
          <Controller
            name="linesToRefund"
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
                getCellError={getCellError}
                rows={order?.lines.length ?? 0}
                selectionActions={values => (
                  <>
                    <Button variant="secondary" onClick={() => onMaxQtySet(values)}>
                      <FormattedMessage {...transactionRefundGridMessages.selectAll} />
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
