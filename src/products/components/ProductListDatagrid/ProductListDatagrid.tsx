import ColumnPicker from "@dashboard/components/ColumnPicker";
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
import { addAtIndex, removeAtIndex } from "@dashboard/utils/lists";
import { GridColumn, Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui/next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { isAttributeColumnValue } from "../ProductListPage/utils";
import { useColumnPickerColumns } from "./hooks/useColumnPickerColumns";
import { useDatagridColumns } from "./hooks/useDatagridColumns";
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
  onSelectProductIds: (rowsIndex: number[], clearSelection: () => void) => void;
  isAttributeLoading?: boolean;
  hasRowHover?: boolean;
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
  columnQuery,
  defaultSettings,
  availableInGridAttributes,
  onColumnQueryChange,
  activeAttributeSortId,
  filterDependency,
  onSelectProductIds,
  hasRowHover,
  rowAnchor,
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

  const { columns, setColumns } = useDatagridColumns({
    activeAttributeSortId,
    gridAttributes,
    gridAttributesFromSettings,
    settings,
    sort,
  });

  const handleColumnMoved = useCallback(
    (startIndex: number, endIndex: number): void => {
      setColumns(old =>
        addAtIndex(old[startIndex], removeAtIndex(old, startIndex), endIndex),
      );
    },
    [setColumns],
  );

  const handleColumnResize = useCallback(
    (column: GridColumn, newSize: number) => {
      if (column.id === "empty") {
        return;
      }

      setColumns(prevColumns =>
        prevColumns.map(prevColumn =>
          prevColumn.id === column.id
            ? { ...prevColumn, width: newSize }
            : prevColumn,
        ),
      );
    },
    [setColumns],
  );

  const columnPickerColumns = useColumnPickerColumns(
    gridAttributes,
    availableInGridAttributes,
    settings,
    defaultSettings.columns,
  );

  const getCellContent = useMemo(
    () =>
      createGetCellContent({
        columns,
        products,
        intl,
        getProductTypes: searchProductType,
        locale,
        gridAttributes,
        gridAttributesFromSettings,
        selectedChannelId,
      }),
    [
      columns,
      gridAttributes,
      gridAttributesFromSettings,
      intl,
      locale,
      products,
      searchProductType,
      selectedChannelId,
    ],
  );

  const handleHeaderClicked = useCallback(
    (col: number) => {
      const { columnName, columnId } = getColumnMetadata(columns[col].id);

      if (canBeSorted(columnName, !!selectedChannelId)) {
        onSort(columnName, columnId);
      }
    },
    [columns, onSort, selectedChannelId],
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
      const { columnName } = getColumnMetadata(columns[colIndex].id);
      // Sortable column or empty
      if (
        canBeSorted(columnName, !!selectedChannelId) ||
        columns[colIndex].id === "empty"
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
    [columns, filterDependency.label, intl, selectedChannelId],
  );

  const handleColumnChange = useCallback(
    (picked: ProductListColumns[]) => {
      onUpdateListSettings("columns", picked);
    },
    [onUpdateListSettings],
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
          onColumnMoved={handleColumnMoved}
          onColumnResize={handleColumnResize}
          verticalBorder={col => col > 0}
          getColumnTooltipContent={handleGetColumnTooltipContent}
          availableColumns={columns}
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
          renderColumnPicker={defaultProps => (
            <ColumnPicker
              {...defaultProps}
              {...columnPickerColumns}
              hasMore={hasMore}
              loading={isAttributeLoading}
              onFetchMore={onFetchMore}
              query={columnQuery}
              onQueryChange={onColumnQueryChange}
              onSave={handleColumnChange}
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
