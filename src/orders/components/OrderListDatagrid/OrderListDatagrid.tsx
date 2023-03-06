import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { OrderListQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { order } from "@dashboard/orders/fixtures";
import { OrderListUrlSortField } from "@dashboard/orders/urls";
import { ListProps, RelayToFlat, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { makeStyles } from "@material-ui/core";
import { Button } from "@saleor/macaw-ui";
import React, { useCallback, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getColumns, useGetCellContent } from "./datagrid";
import { messages } from "./messages";
import { canBeSorted, getColumnMetadata, getOrdersRowsLength } from "./utils";

interface OrderListDatagridProps
  extends ListProps,
    SortPage<OrderListUrlSortField> {
  orders: RelayToFlat<OrderListQuery["orders"]>;
  onRowClick: (id: string) => void;
}
const useStyles = makeStyles(
  theme => ({
    paginationContainer: {
      padding: theme.spacing(0, 4),
    },
  }),
  { name: "OrderListDatagrid" },
);

export const OrderListDatagrid: React.FC<OrderListDatagridProps> = ({
  orders,
  disabled,
  settings,
  onUpdateListSettings,
  onSort,
  sort,
  onRowClick,
}) => {
  const classes = useStyles();
  const intl = useIntl();
  const datagrid = useDatagridChangeState();

  const columns = useMemo(() => getColumns(intl, sort), [intl, sort]);

  const handleHeaderClick = useCallback(
    (col: number) => {
      const { columnName, columnId } = getColumnMetadata(columns[col].id);

      if (canBeSorted(columnName)) {
        onSort(columnName, columnId);
      }
    },
    [columns, onSort],
  );

  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      const rowData = orders[row];
      onRowClick(rowData.id);
    },
    [onRowClick, orders],
  );

  const getCellContent = useGetCellContent({
    columns,
    orders,
    loading: disabled,
  });

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        readonly
        rowMarkers="none"
        columnSelect="single"
        freezeColumns={2}
        verticalBorder={col => (col > 1 ? true : false)}
        availableColumns={columns}
        onHeaderClicked={handleHeaderClick}
        emptyText={intl.formatMessage(messages.emptyText)}
        getCellContent={getCellContent}
        getCellError={() => false}
        menuItems={() => []}
        rows={getOrdersRowsLength(disabled, orders)}
        selectionActions={(indexes, { removeRows }) => (
          <Button variant="tertiary" onClick={() => removeRows(indexes)}>
            <FormattedMessage {...buttonMessages.delete} />
          </Button>
        )}
        title=""
        fullScreenTitle={intl.formatMessage(messages.orders)}
        onRowClick={handleRowClick}
      />

      <div className={classes.paginationContainer}>
        <TablePaginationWithContext
          component="div"
          colSpan={(order?.length === 0 ? 1 : 2) + settings.columns?.length}
          settings={settings}
          disabled={disabled}
          onUpdateListSettings={onUpdateListSettings}
        />
      </div>
    </DatagridChangeStateContext.Provider>
  );
};
