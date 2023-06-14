import {
  CategoryListUrlSortField,
  categoryUrl,
} from "@dashboard/categories/urls";
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
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { createGetCellContent, getColumns } from "./datagrid";

interface CategoryListDatagridProps
  extends Partial<SortPage<CategoryListUrlSortField>>,
    PageListProps {
  categories?: CategoryFragment[];
  disabled: boolean;
  onSelectCategoriesIds: (ids: number[], clearSelection: () => void) => void;
}

export const CategoryListDatagrid = ({
  sort,
  onSort,
  categories,
  disabled,
  onSelectCategoriesIds,
  settings,
  onUpdateListSettings,
}: CategoryListDatagridProps) => {
  const datagridState = useDatagridChangeState();
  const intl = useIntl();
  const availableColumns = useMemo(() => getColumns(intl, sort), [intl, sort]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCellContent = useCallback(
    createGetCellContent(categories, availableColumns),
    [categories, availableColumns],
  );

  const { columns, onColumnMoved, onColumnResize } =
    useColumnsDefault(availableColumns);

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
        hasRowHover
        readonly
        loading={disabled}
        columnSelect="single"
        verticalBorder={col => col > 0}
        rowMarkers="checkbox"
        availableColumns={columns}
        rows={categories?.length ?? 0}
        getCellContent={getCellContent}
        getCellError={() => false}
        emptyText={intl.formatMessage({
          defaultMessage: "No categories found",
          id: "dM86a2",
        })}
        onHeaderClicked={handleHeaderClick}
        rowAnchor={handleRowAnchor}
        menuItems={() => []}
        selectionActions={() => null}
        onColumnResize={onColumnResize}
        onColumnMoved={onColumnMoved}
        onRowSelectionChange={onSelectCategoriesIds}
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
