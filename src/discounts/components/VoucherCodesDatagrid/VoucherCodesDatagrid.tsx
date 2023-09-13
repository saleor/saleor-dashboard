import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { SubMenu } from "@dashboard/components/SubMenu";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { buttonMessages } from "@dashboard/intl";
import {
  ArrowDownIcon,
  Box,
  Button,
  PlusIcon,
  Popover,
  Text,
  TrashBinIcon,
} from "@saleor/macaw-ui/next";
import React, { useCallback, useMemo, useState } from "react";
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
  onVoucherCodeDelete: (code: string) => void;
}

export const VoucherCodesDatagrid = ({
  codes,
  loading,
  disabled,
  onVoucherCodeDelete,
}: VoucherCodesDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);

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

  const handleAutoGenerateCodes = useCallback(() => {
    setSubMenuOpen(false);
  }, []);

  const subMenuItems = useMemo(
    () => [
      {
        id: "auto-generate-codes",
        title: "Auto-generate codes",
        description: "Generate multiple codes at once",
        onClick: handleAutoGenerateCodes,
      },
    ],
    [handleAutoGenerateCodes],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={4}
        paddingX={6}
      >
        <Text variant="heading">Voucher codes</Text>
        <Popover open={isSubMenuOpen} onOpenChange={setSubMenuOpen}>
          <Popover.Trigger>
            <Button
              type="button"
              backgroundColor="interactiveNeutralDefault"
              color="textNeutralContrasted"
            >
              <PlusIcon />
              Add code
              <ArrowDownIcon />
            </Button>
          </Popover.Trigger>
          <Popover.Content align="end">
            <Box marginTop={1}>
              <SubMenu menuItems={subMenuItems} />
            </Box>
          </Popover.Content>
        </Popover>
      </Box>
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
        menuItems={index => [
          {
            label: intl.formatMessage(buttonMessages.delete),
            onSelect: () => {
              onVoucherCodeDelete(codes[index].code);
            },
            Icon: <TrashBinIcon />,
          },
        ]}
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
