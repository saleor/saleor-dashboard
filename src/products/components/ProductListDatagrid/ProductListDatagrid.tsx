// @ts-strict-ignore
import { LazyQueryResult } from "@apollo/client/react";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { commonTooltipMessages } from "@dashboard/components/TooltipTableCellHeader/messages";
import { ProductListColumns } from "@dashboard/config";
import {
  Exact,
  GridAttributesQuery,
  ProductListQuery,
  useAvailableColumnAttributesLazyQuery,
} from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { ProductListUrlSortField } from "@dashboard/products/urls";
import { canBeSorted } from "@dashboard/products/views/ProductList/sort";
import { ChannelProps, ListProps, PageListProps, RelayToFlat, SortPage } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Item } from "@glideapps/glide-data-grid";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { getAttributeIdFromColumnValue, isAttributeColumnValue } from "../ProductListPage/utils";
import {
  createGetCellContent,
  getAttributesFetchMoreProps,
  getAvailableAttributesData,
  getCellAction,
  getColumnMetadata,
  getColumnSortIconName,
  getProductRowsLength,
  productListDynamicColumnAdapter,
  productListStaticColumnAdapter,
} from "./datagrid";
import { messages } from "./messages";
import { usePriceClick } from "./usePriceClick";

interface ProductListDatagridProps
  extends ListProps<ProductListColumns>,
    PageListProps<ProductListColumns>,
    SortPage<ProductListUrlSortField>,
    ChannelProps {
  activeAttributeSortId: string;
  gridAttributesOpts: LazyQueryResult<
    GridAttributesQuery,
    Exact<{
      ids: string | string[];
    }>
  >;
  products: RelayToFlat<ProductListQuery["products"]>;
  onRowClick: (id: string) => void;
  rowAnchor?: (id: string) => string;
  availableColumnsAttributesOpts: ReturnType<typeof useAvailableColumnAttributesLazyQuery>;
  onSelectProductIds: (rowsIndex: number[], clearSelection: () => void) => void;
  hasRowHover?: boolean;
  loading: boolean;
}

export const ProductListDatagrid: React.FC<ProductListDatagridProps> = ({
  products,
  onRowClick,
  disabled,
  settings,
  onUpdateListSettings,
  selectedChannelId,
  onSort,
  sort,
  loading,
  gridAttributesOpts,
  availableColumnsAttributesOpts,
  activeAttributeSortId,
  filterDependency,
  onSelectProductIds,
  hasRowHover,
  rowAnchor,
}) => {
  const isChannelSelected = !!selectedChannelId;
  const intl = useIntl();
  const { theme } = useTheme();
  const datagrid = useDatagridChangeState();
  const { locale } = useLocale();
  const productsLength = getProductRowsLength(disabled, products, disabled);
  const onPriceClick = usePriceClick({ isChannelSelected });

  const handleColumnChange = useCallback(
    (picked: ProductListColumns[]) => {
      onUpdateListSettings("columns", picked.filter(Boolean));
    },
    [onUpdateListSettings],
  );
  const memoizedStaticColumns = useMemo(
    () =>
      productListStaticColumnAdapter({
        intl,
        sort,
        onPriceClick,
      }),
    [intl, sort],
  );
  const [queryAvailableColumnsAttributes, availableColumnsAttributesData] =
    availableColumnsAttributesOpts;
  const {
    handlers,
    visibleColumns,
    staticColumns,
    dynamicColumns,
    selectedColumns,
    columnCategories,
    recentlyAddedColumn,
  } = useColumns({
    gridName: "product_list",
    staticColumns: memoizedStaticColumns,
    columnCategories: productListDynamicColumnAdapter({
      availableAttributesData: getAvailableAttributesData({
        availableColumnsAttributesData,
        gridAttributesOpts,
      }),
      selectedAttributesData: mapEdgesToItems(gridAttributesOpts.data?.selectedAttributes),
      activeAttributeSortId,
      sort,
      onSearch: (query: string) =>
        queryAvailableColumnsAttributes({
          variables: { search: query, first: 10 },
        }),
      initialSearch: availableColumnsAttributesData.variables?.search ?? "",
      ...getAttributesFetchMoreProps({
        queryAvailableColumnsAttributes,
        availableColumnsAttributesData,
        gridAttributesOpts,
      }),
      intl,
    }),
    selectedColumns: settings.columns,
    onSave: handleColumnChange,
  });

  // Logic for updating sort icon in dynamic columns
  // This is workaround before sorting is abstracted into useColumns
  // Tracked in https://github.com/saleor/saleor-dashboard/issues/3685
  React.useEffect(() => {
    handlers.onCustomUpdateVisible(prevColumns =>
      prevColumns?.map(column => {
        if (isAttributeColumnValue(column.id)) {
          if (getAttributeIdFromColumnValue(column.id) === activeAttributeSortId) {
            return {
              ...column,
              icon: getColumnSortIconName(sort, ProductListUrlSortField.attribute),
            };
          }

          return {
            ...column,
            icon: undefined,
          };
        }

        return column;
      }),
    );
  }, [activeAttributeSortId, sort]);

  const handleHeaderClicked = useCallback(
    (col: number) => {
      const { columnName, columnId } = getColumnMetadata(visibleColumns[col].id);

      if (canBeSorted(columnName, !!selectedChannelId)) {
        onSort(columnName, columnId);
      }
    },
    [visibleColumns, onSort, selectedChannelId],
  );
  const handleRowClick = useCallback(
    ([col, row]: Item) => {
      if (!onRowClick) {
        return;
      }

      const action = getCellAction(visibleColumns, col);

      if (action) {
        const result = action(products[row].id);

        if (result) return;
      }

      const rowData = products[row];

      onRowClick(rowData.id);
    },
    [onRowClick, products],
  );
  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      if (!rowAnchor) {
        return;
      }

      const rowData = products[row];

      return rowAnchor(rowData.id);
    },
    [rowAnchor, products],
  );
  const handleGetColumnTooltipContent = useCallback(
    (colIndex: number): string => {
      const { columnName } = getColumnMetadata(visibleColumns[colIndex].id);

      // Sortable column or empty
      if (canBeSorted(columnName, !!selectedChannelId) || visibleColumns[colIndex].id === "empty") {
        return "";
      }

      // No sortable column
      if (!Object.keys(ProductListUrlSortField).includes(columnName)) {
        return intl.formatMessage(commonTooltipMessages.noSortable);
      }

      // Sortable but requrie selected channel
      return intl.formatMessage(commonTooltipMessages.noFilterSelected, {
        filterName: filterDependency.label,
      });
    },
    [visibleColumns, filterDependency.label, intl, selectedChannelId],
  );
  const getCellContent = useMemo(
    () =>
      createGetCellContent({
        columns: visibleColumns,
        products,
        intl,
        theme,
        locale,
        selectedChannelId,
      }),
    [visibleColumns, products, intl, locale, selectedChannelId],
  );

  return (
    <Box __marginTop={productsLength > 0 ? -1 : 0}>
      <DatagridChangeStateContext.Provider value={datagrid}>
        <Datagrid
          readonly
          loading={loading}
          rowMarkers="checkbox-visible"
          columnSelect="single"
          hasRowHover={hasRowHover}
          onColumnMoved={handlers.onMove}
          onColumnResize={handlers.onResize}
          verticalBorder={false}
          getColumnTooltipContent={handleGetColumnTooltipContent}
          availableColumns={visibleColumns}
          onHeaderClicked={handleHeaderClicked}
          emptyText={intl.formatMessage(messages.emptyText)}
          getCellContent={getCellContent}
          getCellError={() => false}
          menuItems={() => []}
          rows={productsLength}
          onRowSelectionChange={onSelectProductIds}
          selectionActions={() => null}
          onRowClick={handleRowClick}
          rowAnchor={handleRowAnchor}
          recentlyAddedColumn={recentlyAddedColumn}
          renderColumnPicker={() => (
            <ColumnPicker
              staticColumns={staticColumns}
              dynamicColumns={dynamicColumns}
              selectedColumns={selectedColumns}
              columnCategories={columnCategories}
              onToggle={handlers.onToggle}
            />
          )}
        />

        <Box paddingX={6}>
          <TablePaginationWithContext
            component="div"
            colSpan={(products?.length === 0 ? 1 : 2) + settings.columns.length}
            settings={settings}
            disabled={disabled}
            onUpdateListSettings={onUpdateListSettings}
          />
        </Box>
      </DatagridChangeStateContext.Provider>
    </Box>
  );
};
