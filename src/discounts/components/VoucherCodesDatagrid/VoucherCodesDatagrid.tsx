import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { UseListSettings } from "@dashboard/hooks/useListSettings";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { createGetCellContent, voucherCodesStaticColumnsAdapter } from "./datagrid";
import { messages } from "./messages";
import { VoucherCode } from "./types";

export interface VoucherCodesDatagridProps {
  codes: VoucherCode[];
  loading?: boolean;
  disabled?: boolean;
  onSelectVoucherCodesIds: (rows: number[], clearSelection: () => void) => void;
  settings: UseListSettings["settings"];
  onSettingsChange: UseListSettings["updateListSettings"];
}

export const VoucherCodesDatagrid = ({
  codes,
  loading = false,
  disabled,
  onSelectVoucherCodesIds,
  onSettingsChange,
  settings,
}: VoucherCodesDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();
  const { theme } = useTheme();
  const voucherCodesStaticColumns = useMemo(() => voucherCodesStaticColumnsAdapter(intl), [intl]);
  const { handlers, visibleColumns } = useColumns({
    staticColumns: voucherCodesStaticColumns,
    selectedColumns: ["code", "usage", "status"],
    onSave: () => {},
  });
  const getCellContent = useCallback(createGetCellContent(codes, visibleColumns, intl, theme), [
    codes,
    visibleColumns,
  ]);

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        loading={loading}
        rowMarkers="checkbox-visible"
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
        onRowSelectionChange={onSelectVoucherCodesIds}
        menuItems={() => []}
      />

      <Box paddingX={6}>
        <TablePaginationWithContext
          component="div"
          settings={settings}
          disabled={disabled}
          onUpdateListSettings={onSettingsChange}
        />
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
