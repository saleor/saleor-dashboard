// @ts-strict-ignore
import ColumnPicker from "@dashboard/components/ColumnPicker";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { useColumnsDefault } from "@dashboard/components/Datagrid/hooks/useColumnsDefault";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { OrderLineFragment } from "@dashboard/graphql";
import { productPath } from "@dashboard/products/urls";
import { ExternalLinkIcon } from "@saleor/macaw-ui/next";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { messages as orderMessages } from "../OrderListDatagrid/messages";
import { useColumns, useGetCellContent } from "./datagrid";
import { messages } from "./messages";

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

  const getMenuItems = useCallback(
    index => [
      {
        label: intl.formatMessage(messages.productDetails),
        Icon: (
          <Link
            to={productPath(lines[index].variant.product.id)}
            target="_blank"
          >
            <ExternalLinkIcon />
          </Link>
        ),
        onSelect: () => false,
      },
    ],
    [intl, lines],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        showEmptyDatagrid
        rowMarkers="none"
        columnSelect="single"
        freezeColumns={1}
        availableColumns={columns}
        emptyText={intl.formatMessage(orderMessages.emptyText)}
        getCellContent={getCellContent}
        getCellError={() => false}
        menuItems={getMenuItems}
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
