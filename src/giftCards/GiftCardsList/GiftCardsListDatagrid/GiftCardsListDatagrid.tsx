import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import TablePagination from "@dashboard/components/TablePagination";
import { giftCardUrl } from "@dashboard/giftCards/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import usePaginator from "@dashboard/hooks/usePaginator";
import { Item } from "@glideapps/glide-data-grid";
import { Box, useTheme } from "@saleor/macaw-ui/next";
import isEqual from "lodash/isEqual";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { useGiftCardList } from "../providers/GiftCardListProvider";
import { canBeSorted } from "../sort";
import { GiftCardListColummns, GiftCardUrlSortField } from "../types";
import { createGetCellContent, getColumns } from "./datagrid";
import { messages } from "./messages";

export const GiftCardsListDatagrid = () => {
  const datagridState = useDatagridChangeState();
  const navigate = useNavigator();
  const intl = useIntl();
  const {
    loading,
    giftCards,
    settings,
    updateListSettings,
    selectedRowIds,
    setSelectedRowIds,
    setClearDatagridRowSelectionCallback,
    sort,
    onSort,
    pageInfo,
    paginationState,
    params,
  } = useGiftCardList();

  const paginationValues = usePaginator({
    pageInfo,
    paginationState,
    queryString: params,
  });

  const availableColumns = useMemo(() => getColumns(intl, sort), [intl, sort]);

  const onColumnChange = useCallback(
    (picked: GiftCardListColummns[]) => {
      if (updateListSettings) {
        updateListSettings("columns", picked.filter(Boolean));
      }
    },
    [updateListSettings],
  );

  const {
    handlers,
    staticColumns,
    visibleColumns,
    selectedColumns,
    recentlyAddedColumn,
  } = useColumns({
    staticColumns: availableColumns,
    selectedColumns: settings?.columns ?? [],
    onSave: onColumnChange,
  });

  const { theme: currentTheme, themeValues } = useTheme();

  const getCellContent = useCallback(
    createGetCellContent(
      giftCards,
      visibleColumns,
      intl,
      themeValues,
      currentTheme,
    ),
    [giftCards, visibleColumns, themeValues, currentTheme],
  );

  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id;

      if (!Object.keys(GiftCardUrlSortField).includes(columnName)) {
        return;
      }

      if (
        canBeSorted(columnName as GiftCardUrlSortField, false) &&
        sort !== undefined
      ) {
        onSort(columnName as GiftCardUrlSortField);
      }
    },
    [visibleColumns, onSort, sort],
  );

  const handleRowAnchor = useCallback(
    ([, row]: Item) => giftCardUrl(giftCards[row].id),
    [giftCards],
  );

  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      navigate(giftCardUrl(giftCards[row].id));
    },
    [giftCards],
  );

  const handleGetColumnTooltipContent = useCallback(() => {
    return "";
  }, []);

  const handleGiftCardSelectionChange = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!giftCards) {
        return;
      }

      const rowsIds = rows.map(row => giftCards[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [
      giftCards,
      setClearDatagridRowSelectionCallback,
      selectedRowIds,
      setSelectedRowIds,
    ],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagridState}>
      <Datagrid
        readonly
        loading={loading}
        rowMarkers="checkbox"
        columnSelect="single"
        hasRowHover={true}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={col => col > 0}
        rows={giftCards?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.noData)}
        onRowSelectionChange={handleGiftCardSelectionChange}
        getCellContent={getCellContent}
        getCellError={() => false}
        selectionActions={() => null}
        menuItems={() => []}
        onRowClick={handleRowClick}
        onHeaderClicked={handleHeaderClick}
        rowAnchor={handleRowAnchor}
        getColumnTooltipContent={handleGetColumnTooltipContent}
        recentlyAddedColumn={recentlyAddedColumn}
        renderColumnPicker={() => (
          <ColumnPicker
            staticColumns={staticColumns}
            selectedColumns={selectedColumns}
            onDynamicColumnSelect={handlers.onDynamicColumnSelect}
            onSave={handlers.onChange}
          />
        )}
      />

      <Box paddingX={6}>
        <TablePagination
          {...paginationValues}
          component="div"
          settings={settings}
          onUpdateListSettings={updateListSettings}
        />
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
