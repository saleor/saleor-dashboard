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
import { CategoryFragment } from "@dashboard/graphql";
import { SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { createGetCellContent, getColumns } from "./datagrid";

interface CategoryListDatagridProps extends SortPage<CategoryListUrlSortField> {
  categories?: CategoryFragment[];
}

export const CategoryListDatagrid = ({
  sort,
  onSort,
  categories,
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
      onSort(columns[col].id as CategoryListUrlSortField);
    },
    [columns, onSort],
  );

  const handleRowAnchor = useCallback(
    ([, row]: Item) => categoryUrl(categories[row].id),
    [categories],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagridState}>
      <Datagrid
        loading={false}
        columnSelect="single"
        verticalBorder={col => (col > 0 ? true : false)}
        freezeColumns={1}
        rowMarkers="checkbox"
        availableColumns={columns}
        rows={categories?.length ?? 0}
        getCellContent={getCellContent}
        getCellError={() => false}
        emptyText="Empty"
        onHeaderClicked={handleHeaderClick}
        rowAnchor={handleRowAnchor}
        menuItems={() => []}
        selectionActions={() => null}
        onColumnResize={onColumnResize}
        onColumnMoved={onColumnMoved}
      />
    </DatagridChangeStateContext.Provider>
  );
};
