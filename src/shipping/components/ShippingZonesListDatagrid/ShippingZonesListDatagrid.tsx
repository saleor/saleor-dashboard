import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { ShippingZoneFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import useNavigator from "@dashboard/hooks/useNavigator";
import { shippingZoneUrl } from "@dashboard/shipping/urls";
import { ListProps } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { createGetCellContent, shippingZonesListStaticColumnsAdapter } from "./datagrid";
import { messages } from "./messages";

type RowData = ShippingZoneFragment | undefined;

interface ShippingZoneListDatagridProps extends ListProps {
  shippingZones: ShippingZoneFragment[] | undefined;
  onSelectShippingZones: (rowsIndex: number[], clearSelection: () => void) => void;
}

export const ShippingZoneListDatagrid = ({
  disabled,
  shippingZones,
  settings,
  onUpdateListSettings,
  onSelectShippingZones,
}: ShippingZoneListDatagridProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const datagridState = useDatagridChangeState();
  const location = useLocation();
  const navigate = useNavigator();
  const shippingZonesListStaticColumns = useMemo(
    () => shippingZonesListStaticColumnsAdapter(intl),
    [intl],
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
    staticColumns: shippingZonesListStaticColumns,
    onSave: onColumnChange,
  });
  const getCellContent = useCallback(
    createGetCellContent({
      shippingZones,
      columns: visibleColumns,
      intl,
      locale,
    }),
    [shippingZones, intl, visibleColumns],
  );
  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      const rowData: RowData = shippingZones?.[row];

      if (rowData) {
        navigate(shippingZoneUrl(rowData.id));
      }
    },
    [shippingZones],
  );
  const handleRowAnchor = useCallback(
    ([, row]: Item) => shippingZoneUrl(shippingZones?.[row].id ?? ""),
    [shippingZones],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagridState}>
      <Datagrid
        readonly
        loading={disabled}
        rowMarkers="checkbox-visible"
        columnSelect="single"
        hasRowHover={true}
        freezeColumns={1}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        onRowSelectionChange={onSelectShippingZones}
        verticalBorder={false}
        rows={shippingZones?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        getCellContent={getCellContent}
        getCellError={() => false}
        selectionActions={() => null}
        menuItems={() => []}
        onRowClick={handleRowClick}
        rowAnchor={handleRowAnchor}
        recentlyAddedColumn={recentlyAddedColumn}
        navigatorOpts={{
          state: {
            prevLocation: location,
          },
        }}
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

export default ShippingZoneListDatagrid;
