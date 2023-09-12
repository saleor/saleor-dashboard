import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { Box } from "@saleor/macaw-ui/next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import {
  createGetCellContent,
  voucherCodesStaticColumnsAdapter,
} from "./datagrid";
import { messages } from "./messages";
import { VoucherCode } from "./types";

interface VoucherCodesDatagridProps {
  codes: VoucherCode[];
  loading: boolean;
  disabled?: boolean;
}

export const VoucherCodesDatagrid = ({
  codes,
  loading,
  disabled,
}: VoucherCodesDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();

  const voucherCodesStaticColumns = useMemo(
    () => voucherCodesStaticColumnsAdapter(intl),
    [intl],
  );

  const { handlers, visibleColumns } = useColumns({
    staticColumns: voucherCodesStaticColumns,
    selectedColumns: ["code", "usage", "limit"],
    onSave: () => {},
  });

  const getCellContent = useCallback(
    createGetCellContent(codes, visibleColumns),
    [codes, visibleColumns],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        readonly
        loading={loading}
        rowMarkers="checkbox"
        columnSelect="single"
        hasRowHover={false}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={col => col > 0}
        rows={codes?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        getCellContent={getCellContent}
        getCellError={() => false}
        selectionActions={() => null}
        menuItems={() => []}
      />

      <Box paddingX={6}>
        <TablePaginationWithContext
          component="div"
          settings={{ rowNumber: 10 }}
          disabled={disabled}
          onUpdateListSettings={() => {}}
        />
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
