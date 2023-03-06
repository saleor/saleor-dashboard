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
import { buttonMessages } from "@dashboard/intl";
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
import { Button } from "@saleor/macaw-ui";
import { sprinkles } from "@saleor/macaw-ui/next";
import React, { useCallback, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { isAttributeColumnValue } from "../ProductListPage/utils";
import { messages } from "./messages";
import { useColumnPickerColumns } from "./useColumnPickerColumns";
import {
  createGetCellContent,
  getColumnMetadata,
  getColumns,
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
  onRowClick: (id: string) => void;
  columnQuery: string;
  availableInGridAttributes: RelayToFlat<
    SearchAvailableInGridAttributesQuery["availableInGrid"]
  >;
  onColumnQueryChange: (query: string) => void;
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
  gridAttributes,
  hasMore,
  loading,
  onFetchMore,
  columnQuery,
  defaultSettings,
  availableInGridAttributes,
  onColumnQueryChange,
  activeAttributeSortId,
  filterDependency,
}) => {
  const intl = useIntl();
  const searchProductType = useSearchProductTypes();
  const datagrid = useDatagridChangeState();
  const { locale } = useLocale();
  const gridAttributesFromSettings = settings.columns.filter(
    isAttributeColumnValue,
  );

  const columns = useMemo(
    () =>
      getColumns({
        intl,
        sort,
        gridAttributes,
        gridAttributesFromSettings,
        settings,
        activeAttributeSortId,
      }),
    [
      activeAttributeSortId,
      gridAttributes,
      gridAttributesFromSettings,
      intl,
      settings,
      sort,
    ],
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
        loading: disabled,
      }),
    [
      columns,
      disabled,
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
      const rowData = products[row];
      onRowClick(rowData.id);
    },
    [onRowClick, products],
  );

  const handleGetColumnTooltipContent = useCallback(
    (colIndex: number): string => {
      const { columnName } = getColumnMetadata(columns[colIndex].id);
      // Sortable column
      if (canBeSorted(columnName, !!selectedChannelId)) {
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

  const onColumnsChange = useCallback(
    (columns: ProductListColumns[]) => onUpdateListSettings("columns", columns),
    [onUpdateListSettings],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        readonly
        rowMarkers="none"
        columnSelect="single"
        freezeColumns={2}
        verticalBorder={col => (col > 1 ? true : false)}
        getColumnTooltipContent={handleGetColumnTooltipContent}
        availableColumns={columns}
        onHeaderClicked={handleHeaderClicked}
        emptyText={intl.formatMessage(messages.emptyText)}
        getCellContent={getCellContent}
        getCellError={() => false}
        menuItems={() => []}
        rows={getProductRowsLength(disabled, products)}
        selectionActions={(indexes, { removeRows }) => (
          <Button variant="tertiary" onClick={() => removeRows(indexes)}>
            <FormattedMessage {...buttonMessages.delete} />
          </Button>
        )}
        fullScreenTitle={intl.formatMessage(messages.products)}
        onRowClick={handleRowClick}
        renderColumnPicker={defaultProps => (
          <ColumnPicker
            {...defaultProps}
            {...columnPickerColumns}
            hasMore={hasMore}
            loading={loading}
            onFetchMore={onFetchMore}
            query={columnQuery}
            onQueryChange={onColumnQueryChange}
            onSave={onColumnsChange}
          />
        )}
      />

      <div className={sprinkles({ paddingX: 9 })}>
        <TablePaginationWithContext
          component="div"
          colSpan={(products?.length === 0 ? 1 : 2) + settings.columns.length}
          settings={settings}
          disabled={disabled}
          onUpdateListSettings={onUpdateListSettings}
        />
      </div>
    </DatagridChangeStateContext.Provider>
  );
};
