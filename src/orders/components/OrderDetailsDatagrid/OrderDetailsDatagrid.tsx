import ColumnPicker from "@dashboard/components/ColumnPicker";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { useColumnsDefault } from "@dashboard/components/Datagrid/hooks/useColumnsDefault";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { OrderLineFragment } from "@dashboard/graphql";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../OrderListDatagrid/messages";
import { useColumns, useGetCellContent } from "./datagrid";

interface OrderDetailsDatagridProps {
  lines: OrderLineFragment[];
  loading: boolean;
}

export const OrderDetailsDatagrid = ({
  lines,
  loading,
}: OrderDetailsDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();

  const availableColumns = useColumns();

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

  const getCellContent = useGetCellContent({
    columns,
    data: lines,
    loading,
  });

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        readonly
        showEmptyDatagrid
        rowMarkers="none"
        columnSelect="single"
        freezeColumns={1}
        availableColumns={columns}
        emptyText={intl.formatMessage(messages.emptyText)}
        getCellContent={getCellContent}
        getCellError={() => false}
        menuItems={() => []}
        rows={loading ? 1 : lines.length}
        selectionActions={() => null}
        onColumnResize={onColumnResize}
        onColumnMoved={onColumnMoved}
        renderColumnPicker={defaultProps => (
          <ColumnPicker
            {...defaultProps}
            IconButtonProps={{
              ...defaultProps.IconButtonProps,
              disabled: lines.length === 0,
            }}
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
    </DatagridChangeStateContext.Provider>
  );
};
