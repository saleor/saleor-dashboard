import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { DiscountListUrlSortField, discountUrl } from "@dashboard/discounts/discountsUrls";
import { PromotionFragment } from "@dashboard/graphql";
import { ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { canBeSorted } from "../../views/DiscountList/sort";
import { createGetCellContent, dicountListStaticColumnsAdapter } from "./datagrid";
import { messages } from "./messages";

interface DiscountListDatagridProps extends ListProps, SortPage<DiscountListUrlSortField> {
  promotions: PromotionFragment[];
  onRowClick: (id: string) => void;
  hasRowHover?: boolean;
}

export const DiscountListDatagrid = ({
  disabled,
  onSort,
  promotions,
  sort,
  onUpdateListSettings,
  onRowClick,
  hasRowHover = true,
  settings,
}: DiscountListDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();
  const emptyColumn = useEmptyColumn();
  const discountListStaticColumns = useMemo(
    () => dicountListStaticColumnsAdapter(intl, sort, emptyColumn),
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
  const { handlers, visibleColumns, staticColumns, selectedColumns, recentlyAddedColumn } =
    useColumns({
      gridName: "discount_list",
      staticColumns: discountListStaticColumns,
      selectedColumns: settings?.columns ?? [],
      onSave: onColumnChange,
    });
  const getCellContent = useCallback(
    createGetCellContent({
      promotions,
      columns: visibleColumns,
      intl,
    }),
    [promotions, visibleColumns],
  );
  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!onRowClick) {
        return;
      }

      const rowData: PromotionFragment = promotions[row];

      onRowClick(rowData.id);
    },
    [onRowClick, promotions],
  );
  const handleRowAnchor = useCallback(
    ([, row]: Item) => discountUrl(promotions[row].id),
    [promotions],
  );
  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as DiscountListUrlSortField;

      if (canBeSorted(columnName)) {
        onSort(columnName);
      }
    },
    [visibleColumns, onSort],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        readonly
        loading={disabled}
        rowMarkers="none"
        columnSelect="single"
        hasRowHover={hasRowHover}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={col => col > 1}
        rows={promotions?.length ?? 0}
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
        renderColumnPicker={() => (
          <ColumnPicker
            staticColumns={staticColumns}
            selectedColumns={selectedColumns}
            onToggle={handlers.onToggle}
          />
        )}
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
