import { AttributeListUrlSortField, attributeUrl } from "@dashboard/attributes/urls";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { AttributeFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { attributesListStaticColumnsAdapter, createGetCellContent } from "./datagrid";
import { messages } from "./messages";

interface AttributeListDatagridProps extends ListProps, SortPage<AttributeListUrlSortField> {
  attributes: AttributeFragment[];
  onSelectAttributesIds: (rowsIndex: number[], clearSelection: () => void) => void;
}

export const AttributeListDatagrid = ({
  attributes,
  settings,
  sort,
  disabled,
  onSort,
  onSelectAttributesIds,
  onUpdateListSettings,
}: AttributeListDatagridProps) => {
  const datagridState = useDatagridChangeState();
  const location = useLocation();
  const navigate = useNavigator();
  const intl = useIntl();
  const attributesListStaticColumns = useMemo(
    () => attributesListStaticColumnsAdapter(intl, sort),
    [intl, sort],
  );
  const onColumnChange = useCallback(
    (picked: string[]) => {
      if (onUpdateListSettings) {
        onUpdateListSettings("columns", picked.filter(Boolean));
      }
    },
    [onUpdateListSettings],
  );
  const { handlers, visibleColumns, recentlyAddedColumn, staticColumns, selectedColumns } =
    useColumns({
      selectedColumns: settings?.columns ?? [],
      staticColumns: attributesListStaticColumns,
      onSave: onColumnChange,
    });
  const getCellContent = useCallback(
    createGetCellContent({
      attributes,
      columns: visibleColumns,
      intl,
    }),
    [attributes, intl, visibleColumns],
  );
  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      const rowData: AttributeFragment = attributes[row];

      if (rowData) {
        navigate(attributeUrl(rowData.id), {
          state: {
            prevLocation: location,
          },
        });
      }
    },
    [attributes],
  );
  const handleRowAnchor = useCallback(
    ([, row]: Item) => attributeUrl(attributes[row].id),
    [attributes],
  );
  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as AttributeListUrlSortField;

      onSort(columnName);
    },
    [visibleColumns, onSort],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagridState}>
      <Datagrid
        readonly
        loading={disabled}
        rowMarkers="checkbox-visible"
        columnSelect="single"
        hasRowHover={true}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={false}
        rows={attributes?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        onRowSelectionChange={onSelectAttributesIds}
        getCellContent={getCellContent}
        getCellError={() => false}
        selectionActions={() => null}
        menuItems={() => []}
        onRowClick={handleRowClick}
        onHeaderClicked={handleHeaderClick}
        rowAnchor={handleRowAnchor}
        recentlyAddedColumn={recentlyAddedColumn}
        renderColumnPicker={() => (
          <ColumnPicker
            staticColumns={staticColumns}
            selectedColumns={selectedColumns}
            onToggle={handlers.onToggle}
          />
        )}
      />

      <Box paddingX={6}>
        <TablePaginationWithContext
          component="div"
          settings={settings}
          disabled={disabled}
          onUpdateListSettings={onUpdateListSettings}
        />
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
