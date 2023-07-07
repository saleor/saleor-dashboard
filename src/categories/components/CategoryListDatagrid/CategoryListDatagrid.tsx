// @ts-strict-ignore
import {
  CategoryListUrlSortField,
  categoryUrl,
} from "@dashboard/categories/urls";
import ColumnPicker from "@dashboard/components/ColumnPicker";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { useColumnsDefault } from "@dashboard/components/Datagrid/hooks/useColumnsDefault";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { CategoryFragment } from "@dashboard/graphql";
import { PageListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui/next";
import React, { ReactNode, useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { createGetCellContent, getColumns } from "./datagrid";
import { messages } from "./messages";

interface CategoryListDatagridProps
  extends Partial<SortPage<CategoryListUrlSortField>>,
    PageListProps {
  categories?: CategoryFragment[];
  disabled: boolean;
  onSelectCategoriesIds: (ids: number[], clearSelection: () => void) => void;
  selectionActionButton?: ReactNode | null;
  hasRowHover?: boolean;
}

export const CategoryListDatagrid = ({
  sort,
  onSort,
  categories,
  disabled,
  onSelectCategoriesIds,
  settings,
  onUpdateListSettings,
  selectionActionButton = null,
  hasRowHover = true,
}: CategoryListDatagridProps) => {
  const datagridState = useDatagridChangeState();
  const intl = useIntl();
  const availableColumns = useMemo(() => getColumns(intl, sort), [intl, sort]);

  const {
    availableColumnsChoices,
    columnChoices,
    columns,
    defaultColumns,
    onColumnMoved,
    onColumnResize,
    onColumnsChange,
    picker,
  } = useColumnsDefault(availableColumns);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCellContent = useCallback(
    createGetCellContent(categories, columns),
    [categories, columns],
  );

  const handleHeaderClick = useCallback(
    (col: number) => {
      if (sort !== undefined) {
        onSort(columns[col].id as CategoryListUrlSortField);
      }
    },
    [columns, onSort, sort],
  );

  const handleRowAnchor = useCallback(
    ([, row]: Item) => categoryUrl(categories[row].id),
    [categories],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagridState}>
      <Datagrid
        readonly
        hasRowHover={hasRowHover}
        loading={disabled}
        columnSelect={sort !== undefined ? "single" : undefined}
        verticalBorder={col => col > 0}
        rowMarkers="checkbox"
        availableColumns={columns}
        rows={categories?.length ?? 0}
        getCellContent={getCellContent}
        getCellError={() => false}
        emptyText={intl.formatMessage(messages.noData)}
        onHeaderClicked={handleHeaderClick}
        rowAnchor={handleRowAnchor}
        menuItems={() => []}
        actionButtonPosition="right"
        selectionActions={() => selectionActionButton}
        onColumnResize={onColumnResize}
        onColumnMoved={onColumnMoved}
        onRowSelectionChange={onSelectCategoriesIds}
        renderColumnPicker={defaultProps => (
          <ColumnPicker
            {...defaultProps}
            availableColumns={availableColumnsChoices}
            initialColumns={columnChoices}
            defaultColumns={defaultColumns}
            onSave={onColumnsChange}
            hasMore={false}
            loading={false}
            onFetchMore={() => undefined}
            onQueryChange={picker.setQuery}
            query={picker.query}
          />
        )}
      />

      <Box paddingX={6}>
        <TablePaginationWithContext
          component="div"
          colSpan={1}
          settings={settings}
          disabled={disabled}
          onUpdateListSettings={onUpdateListSettings}
        />
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
