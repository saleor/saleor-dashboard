import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { CategoryDetailsQuery } from "@dashboard/graphql";
import { productUrl } from "@dashboard/products/urls";
import { PageListProps, RelayToFlat } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { ReactNode, useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { createGetCellContent, getColumns } from "./datagrid";

interface CategoryListDatagridProps extends PageListProps {
  products?: RelayToFlat<NonNullable<CategoryDetailsQuery["category"]>["products"]>;
  disabled: boolean;
  selectionActionButton?: ReactNode | null;
  onSelectProductsIds: (ids: number[], clearSelection: () => void) => void;
}

export const CategoryProductListDatagrid = ({
  products,
  disabled,
  onSelectProductsIds,
  settings,
  onUpdateListSettings,
  selectionActionButton = null,
}: CategoryListDatagridProps) => {
  const datagridState = useDatagridChangeState();
  const intl = useIntl();
  const availableColumns = useMemo(() => getColumns(intl), [intl]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCellContent = useCallback(createGetCellContent(products!, availableColumns), [
    products,
    availableColumns,
  ]);
  const { visibleColumns, handlers } = useColumns({
    staticColumns: availableColumns,
    selectedColumns: ["name"],
    onSave: () => null,
  });
  const handleRowAnchor = useCallback(([, row]: Item) => productUrl(products![row].id), [products]);

  return (
    <DatagridChangeStateContext.Provider value={datagridState}>
      <Datagrid
        hasRowHover
        readonly
        actionButtonPosition="right"
        loading={disabled}
        verticalBorder={false}
        rowMarkers="checkbox-visible"
        availableColumns={visibleColumns}
        rows={products?.length ?? 0}
        getCellContent={getCellContent}
        getCellError={() => false}
        emptyText={intl.formatMessage({
          defaultMessage: "No products found",
          id: "Q1Uzbb",
        })}
        rowAnchor={handleRowAnchor}
        menuItems={() => []}
        selectionActions={() => selectionActionButton}
        onColumnResize={handlers.onResize}
        onColumnMoved={handlers.onMove}
        onRowSelectionChange={onSelectProductsIds}
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
