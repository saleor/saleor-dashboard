import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import Checkbox from "@saleor/components/Checkbox";
import { DateTime } from "@saleor/components/Date";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellHeader from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import { TablePaginationWithContext } from "@saleor/components/TablePagination";
import TableRowLink from "@saleor/components/TableRowLink";
import { OrderDraftListQuery } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import {
  maybe,
  renderCollection,
  transformOrderStatus,
  transformPaymentStatus,
} from "@saleor/misc";
import { OrderDraftListUrlSortField, orderUrl } from "@saleor/orders/urls";
import { ListActions, ListProps, RelayToFlat, SortPage } from "@saleor/types";
import { getArrowDirection } from "@saleor/utils/sort";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colCustomer: {
        width: 300,
      },
      colDate: {
        width: 300,
      },
      colNumber: {
        width: 160,
      },
      colTotal: {},
    },
    colCustomer: {},
    colDate: {},
    colNumber: {
      paddingLeft: 0,
    },
    colTotal: {
      textAlign: "right",
    },
    link: {
      cursor: "pointer",
    },
  }),
  { name: "OrderDraftList" },
);

interface OrderDraftListProps
  extends ListProps,
    ListActions,
    SortPage<OrderDraftListUrlSortField> {
  orders: RelayToFlat<OrderDraftListQuery["draftOrders"]>;
}

export const OrderDraftList: React.FC<OrderDraftListProps> = props => {
  const {
    disabled,
    settings,
    orders,
    onUpdateListSettings,
    onSort,
    isChecked,
    selected,
    sort,
    toggle,
    toggleAll,
    toolbar,
  } = props;

  const classes = useStyles(props);

  const intl = useIntl();

  const orderDraftList = orders
    ? orders.map(order => ({
        ...order,
        paymentStatus: transformPaymentStatus(order.paymentStatus, intl),
        status: transformOrderStatus(order.status, intl),
      }))
    : undefined;

  const numberOfColumns = orderDraftList?.length === 0 ? 4 : 5;

  return (
    <ResponsiveTable>
      <TableHead
        colSpan={numberOfColumns}
        selected={selected}
        disabled={disabled}
        items={orders}
        toggleAll={toggleAll}
        toolbar={toolbar}
      >
        <TableCellHeader
          direction={
            sort.sort === OrderDraftListUrlSortField.number
              ? getArrowDirection(sort.asc)
              : undefined
          }
          arrowPosition="right"
          onClick={() => onSort(OrderDraftListUrlSortField.number)}
          className={classes.colNumber}
        >
          <FormattedMessage id="ps0WUQ" defaultMessage="No. of Order" />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === OrderDraftListUrlSortField.date
              ? getArrowDirection(sort.asc)
              : undefined
          }
          onClick={() => onSort(OrderDraftListUrlSortField.date)}
          className={classes.colDate}
        >
          <FormattedMessage
            id="mCP0UD"
            defaultMessage="Date"
            description="order draft creation date"
          />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === OrderDraftListUrlSortField.customer
              ? getArrowDirection(sort.asc)
              : undefined
          }
          onClick={() => onSort(OrderDraftListUrlSortField.customer)}
          className={classes.colCustomer}
        >
          <FormattedMessage id="hkENym" defaultMessage="Customer" />
        </TableCellHeader>
        <TableCellHeader textAlign="right" className={classes.colTotal}>
          <FormattedMessage
            id="1Uj0Wd"
            defaultMessage="Total"
            description="order draft total price"
          />
        </TableCellHeader>
      </TableHead>
      <TableFooter>
        <TableRow>
          <TablePaginationWithContext
            colSpan={numberOfColumns}
            settings={settings}
            onUpdateListSettings={onUpdateListSettings}
          />
        </TableRow>
      </TableFooter>
      <TableBody>
        {renderCollection(
          orderDraftList,
          order => {
            const isSelected = order ? isChecked(order.id) : false;

            return (
              <TableRowLink
                data-test-id="draft-order-table-row"
                hover={!!order}
                className={!!order ? classes.link : undefined}
                href={order && orderUrl(order.id)}
                key={order ? order.id : "skeleton"}
                selected={isSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(order.id)}
                  />
                </TableCell>
                <TableCell className={classes.colNumber}>
                  {maybe(() => order.number) ? (
                    "#" + order.number
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colDate}>
                  {maybe(() => order.created) ? (
                    <DateTime date={order.created} />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colCustomer}>
                  {maybe(() => order.billingAddress) ? (
                    <>
                      {order.billingAddress.firstName}
                      &nbsp;
                      {order.billingAddress.lastName}
                    </>
                  ) : maybe(() => order.userEmail) !== undefined ? (
                    order.userEmail
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colTotal} align="right">
                  {maybe(() => order.total.gross) ? (
                    <Money money={order.total.gross} />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
              </TableRowLink>
            );
          },
          () => (
            <TableRow>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage
                  id="KIh25E"
                  defaultMessage="No draft orders found"
                />
              </TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
OrderDraftList.displayName = "OrderDraftList";
export default OrderDraftList;
