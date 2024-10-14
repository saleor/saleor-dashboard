import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import TablePagination from "@dashboard/components/TablePagination";
import { commonTooltipMessages } from "@dashboard/components/TooltipTableCellHeader/messages";
import { giftCardListUrl, giftCardUrl } from "@dashboard/giftCards/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import usePaginator from "@dashboard/hooks/usePaginator";
import { Item } from "@glideapps/glide-data-grid";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import isEqual from "lodash/isEqual";
import React, { useCallback, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { messages as filterLabels } from "../filters";
import { useGiftCardList } from "../providers/GiftCardListProvider";
import { canBeSorted } from "../sort";
import { GiftCardListColummns, GiftCardUrlSortField } from "../types";
import { createGetCellContent, getColumns } from "./datagrid";
import { messages } from "./messages";

export const GiftCardsListDatagrid = () => {
  const datagridState = useDatagridChangeState();
  const navigate = useNavigator();
  const location = useLocation();
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
  const isCurrencySelected = !!params.currency;
  const paginationValues = usePaginator({
    pageInfo,
    paginationState,
    queryString: params,
  });
  const availableColumns = useMemo(() => getColumns(intl, sort), [intl, sort]);
  const onColumnChange = useCallback(
    (columns: string[]) => {
      if (updateListSettings) {
        updateListSettings("columns", (columns as GiftCardListColummns[]).filter(Boolean));
      }
    },
    [updateListSettings],
  );
  const { handlers, staticColumns, visibleColumns, selectedColumns, recentlyAddedColumn } =
    useColumns({
      gridName: "gift_cards_list",
      staticColumns: availableColumns,
      selectedColumns: settings?.columns ?? [],
      onSave: onColumnChange,
    });
  const { theme: currentTheme } = useTheme();
  const getCellContent = useCallback(
    createGetCellContent(giftCards, visibleColumns, intl, currentTheme),
    [giftCards, visibleColumns, currentTheme],
  );
  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id;

      if (!Object.keys(GiftCardUrlSortField).includes(columnName)) {
        return null;
      }

      if (
        canBeSorted(columnName as GiftCardUrlSortField, isCurrencySelected) &&
        sort !== undefined
      ) {
        onSort(columnName as GiftCardUrlSortField);
      }
    },
    [visibleColumns, onSort, sort, isCurrencySelected],
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
  const handleGetColumnTooltipContent = useCallback(
    (colIndex: number) => {
      const columnName = visibleColumns[colIndex].id;

      if (canBeSorted(columnName as GiftCardUrlSortField, isCurrencySelected)) {
        return "";
      }

      return intl.formatMessage(commonTooltipMessages.noFilterSelected, {
        filterName: filterLabels.currencyLabel.defaultMessage,
      });
    },
    [visibleColumns, isCurrencySelected],
  );
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
    [giftCards, selectedRowIds],
  );

  useEffect(() => {
    if (params.sort && !canBeSorted(params.sort, isCurrencySelected)) {
      navigate(
        giftCardListUrl({
          ...params,
          sort: GiftCardUrlSortField.usedBy,
        }),
      );
    }
  });

  return (
    <DatagridChangeStateContext.Provider value={datagridState}>
      <Datagrid
        readonly
        loading={loading}
        rowMarkers="checkbox-visible"
        columnSelect="single"
        hasRowHover={true}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={false}
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
            onToggle={handlers.onToggle}
          />
        )}
        navigatorOpts={{
          state: {
            prevLocation: location,
          },
        }}
      />

      <Box paddingX={6}>
        <TablePagination
          hasNextPage={paginationValues?.hasNextPage ?? false}
          nextHref={paginationValues.nextHref}
          hasPreviousPage={paginationValues?.hasPreviousPage ?? false}
          prevHref={paginationValues?.prevHref}
          component="div"
          settings={settings}
          onUpdateListSettings={updateListSettings}
        />
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
