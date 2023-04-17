import { NewColumPicker } from "@dashboard/components/ColumnPicker/NewColumPicker";
import {
  parseCustomColumnsForProductListView,
  parseStaticColumnsForProductListView,
  useColumns,
} from "@dashboard/components/ColumnPicker/utils";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { commonTooltipMessages } from "@dashboard/components/TooltipTableCellHeader/messages";
import { ProductListColumns } from "@dashboard/config";
import {
  GridAttributesQuery,
  ProductListQuery,
  SearchAvailableInGridAttributesQuery,
} from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { ProductListUrlSortField } from "@dashboard/products/urls";
import { canBeSorted } from "@dashboard/products/views/ProductList/sort";
import { useSearchProductTypes } from "@dashboard/searches/useProductTypeSearch";
import {
  ChannelProps,
  FetchMoreProps,
  ListProps,
  PageListProps,
  RelayToFlat,
  SortPage,
} from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui/next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { isAttributeColumnValue } from "../ProductListPage/utils";
import { messages } from "./messages";
import {
  createGetCellContent,
  getColumnMetadata,
  getProductRowsLength,
} from "./utils";

interface ProductListDatagridProps
  extends ListProps<ProductListColumns>,
    PageListProps<ProductListColumns>,
    SortPage<ProductListUrlSortField>,
    FetchMoreProps,
    ChannelProps {
  activeAttributeSortId: string;
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>;
  products: RelayToFlat<ProductListQuery["products"]>;
  onRowClick?: (id: string) => void;
  rowAnchor?: (id: string) => string;
  columnQuery: string;
  availableInGridAttributes: RelayToFlat<
    SearchAvailableInGridAttributesQuery["availableInGrid"]
  >;
  onColumnQueryChange: (query: string) => void;
  isAttributeLoading?: boolean;
  hasRowHover?: boolean;
  customColumnSettings: string[];
  setCustomColumnSettings: (cols: string[]) => void;
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
  hasMore,
  isAttributeLoading,
  onFetchMore,
  // columnQuery,
  // defaultSettings,
  availableInGridAttributes,
  onColumnQueryChange,
  activeAttributeSortId,
  filterDependency,
  hasRowHover,
  rowAnchor,
  customColumnSettings,
  setCustomColumnSettings,
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

  const emptyColumn = useEmptyColumn();

  const {
    handlers,
    visibleColumns,
    staticColumns,
    customColumns,
    selectedColumns,
    columnCategories,
  } = useColumns({
    staticColumns: parseStaticColumnsForProductListView(
      intl,
      emptyColumn,
      sort,
    ),
    columnCategories: parseCustomColumnsForProductListView({
      attributesData: availableInGridAttributes,
      gridAttributesData: gridAttributes,
      activeAttributeSortId,
      sort,
      onSearch: onColumnQueryChange,
      onFetchMore,
      hasMore,
      loading: isAttributeLoading,
    }),
    selectedColumns: settings.columns,
    onSave: handleColumnChange,
    customColumnSettings,
    setCustomColumnSettings,
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
          rowMarkers="none"
          columnSelect="single"
          freezeColumns={1}
          hasRowHover={hasRowHover}
          onColumnMoved={handlers.onMove}
          onColumnResize={handlers.onResize}
          verticalBorder={col => (col > 1 ? true : false)}
          getColumnTooltipContent={handleGetColumnTooltipContent}
          availableColumns={visibleColumns}
          onHeaderClicked={handleHeaderClicked}
          emptyText={intl.formatMessage(messages.emptyText)}
          getCellContent={getCellContent}
          getCellError={() => false}
          menuItems={() => []}
          rows={productsLength}
          selectionActions={() => null}
          fullScreenTitle={intl.formatMessage(messages.products)}
          onRowClick={handleRowClick}
          rowAnchor={handleRowAnchor}
          renderColumnPicker={() => (
            <NewColumPicker
              staticColumns={staticColumns}
              customColumns={customColumns}
              selectedColumns={selectedColumns}
              columnCategories={columnCategories}
              onCustomColumnSelect={handlers.onCustomColumnSelect}
              customColumnSettings={customColumnSettings}
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
