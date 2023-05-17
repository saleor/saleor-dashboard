import { NewColumnPicker } from "@dashboard/components/ColumnPicker/NewColumnPicker";
import { useColumns } from "@dashboard/components/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { commonTooltipMessages } from "@dashboard/components/TooltipTableCellHeader/messages";
import { ProductListColumns } from "@dashboard/config";
import {
  GridAttributesQuery,
  ProductListQuery,
  useAvailableColumnAttributesQuery,
} from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { ProductListUrlSortField } from "@dashboard/products/urls";
import { canBeSorted } from "@dashboard/products/views/ProductList/sort";
import { useSearchProductTypes } from "@dashboard/searches/useProductTypeSearch";
import {
  ChannelProps,
  ListProps,
  PageListProps,
  RelayToFlat,
  SortPage,
} from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui/next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { isAttributeColumnValue } from "../ProductListPage/utils";
import {
  createGetCellContent,
  getColumnMetadata,
  getProductRowsLength,
  productListDynamicColumnAdapter,
  productListStaticColumnAdapter,
} from "./datagrid";
import { messages } from "./messages";

interface ProductListDatagridProps
  extends ListProps<ProductListColumns>,
    PageListProps<ProductListColumns>,
    SortPage<ProductListUrlSortField>,
    ChannelProps {
  activeAttributeSortId: string;
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>;
  products: RelayToFlat<ProductListQuery["products"]>;
  onRowClick: (id: string) => void;
  rowAnchor?: (id: string) => string;
  availableColumnsAttributesOpts: ReturnType<
    typeof useAvailableColumnAttributesQuery
  >;
  onSelectProductIds: (rowsIndex: number[], clearSelection: () => void) => void;
  hasRowHover?: boolean;
  columnPickerSettings: string[];
  setDynamicColumnSettings: (cols: string[]) => void;
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
  gridAttributes,
  availableColumnsAttributesOpts,
  activeAttributeSortId,
  filterDependency,
  onSelectProductIds,
  hasRowHover,
  rowAnchor,
  columnPickerSettings,
  setDynamicColumnSettings,
}) => {
  const intl = useIntl();
  const searchProductType = useSearchProductTypes();
  const datagrid = useDatagridChangeState();
  const { locale } = useLocale();
  const productsLength = getProductRowsLength(disabled, products, disabled);
  const gridAttributesFromSettings = useMemo(
    () => settings.columns.filter(isAttributeColumnValue),
    [settings.columns],
  );

  const handleColumnChange = useCallback(
    (picked: ProductListColumns[]) => {
      onUpdateListSettings("columns", picked.filter(Boolean));
    },
    [onUpdateListSettings],
  );

  const {
    handlers,
    visibleColumns,
    staticColumns,
    dynamicColumns,
    selectedColumns,
    columnCategories,
    recentlyAddedColumn,
  } = useColumns({
    staticColumns: productListStaticColumnAdapter(intl, sort),
    columnCategories: productListDynamicColumnAdapter({
      attributesData:
        mapEdgesToItems(availableColumnsAttributesOpts.data?.attributes) || [],
      gridAttributesData: gridAttributes,
      activeAttributeSortId,
      sort,
      onSearch: (query: string) =>
        availableColumnsAttributesOpts.refetch({ search: query }),
      onNextPage: (query: string) =>
        availableColumnsAttributesOpts.refetch({
          search: query,
          after:
            availableColumnsAttributesOpts.data?.attributes?.pageInfo.endCursor,
          first: 10,
          last: null,
          before: null,
        }),
      onPreviousPage: (query: string) =>
        availableColumnsAttributesOpts.refetch({
          search: query,
          before:
            availableColumnsAttributesOpts.data?.attributes?.pageInfo
              .startCursor,
          last: 10,
          first: null,
          after: null,
        }),
      hasNextPage:
        availableColumnsAttributesOpts.data?.attributes?.pageInfo
          ?.hasNextPage ?? false,
      hasPreviousPage:
        availableColumnsAttributesOpts.data?.attributes?.pageInfo
          ?.hasPreviousPage ?? false,
      intl,
    }),
    selectedColumns: settings.columns,
    onSave: handleColumnChange,
    columnPickerSettings,
    setDynamicColumnSettings,
  });

  const handleHeaderClicked = useCallback(
    (col: number) => {
      const { columnName, columnId } = getColumnMetadata(
        visibleColumns[col].id,
      );

      if (canBeSorted(columnName, !!selectedChannelId)) {
        onSort(columnName, columnId);
      }
    },
    [visibleColumns, onSort, selectedChannelId],
  );

  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!onRowClick) {
        return;
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
      if (
        canBeSorted(columnName, !!selectedChannelId) ||
        visibleColumns[colIndex].id === "empty"
      ) {
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
        getProductTypes: searchProductType,
        locale,
        gridAttributes,
        gridAttributesFromSettings,
        selectedChannelId,
      }),
    [
      visibleColumns,
      gridAttributes,
      gridAttributesFromSettings,
      intl,
      locale,
      products,
      searchProductType,
      selectedChannelId,
    ],
  );

  return (
    <Box __marginTop={productsLength > 0 ? -1 : 0}>
      <DatagridChangeStateContext.Provider value={datagrid}>
        <Datagrid
          readonly
          loading={loading}
          rowMarkers="checkbox"
          columnSelect="single"
          hasRowHover={hasRowHover}
          onColumnMoved={handlers.onMove}
          onColumnResize={handlers.onResize}
          verticalBorder={col => col > 0}
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
          fullScreenTitle={intl.formatMessage(messages.products)}
          onRowClick={handleRowClick}
          rowAnchor={handleRowAnchor}
          recentlyAddedColumn={recentlyAddedColumn}
          renderColumnPicker={() => (
            <NewColumnPicker
              staticColumns={staticColumns}
              dynamicColumns={dynamicColumns}
              selectedColumns={selectedColumns}
              columnCategories={columnCategories}
              onDynamicColumnSelect={handlers.onDynamicColumnSelect}
              columnPickerSettings={columnPickerSettings}
              onSave={handlers.onChange}
            />
          )}
        />

        <Box paddingX={9}>
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
