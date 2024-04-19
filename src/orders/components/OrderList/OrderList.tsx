// @ts-strict-ignore
import { DateTime } from "@dashboard/components/Date";
import Money from "@dashboard/components/Money";
import { Pill } from "@dashboard/components/Pill";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { OrderListQuery } from "@dashboard/graphql";
import {
  maybe,
  renderCollection,
  transformOrderStatus,
  transformPaymentStatus,
} from "@dashboard/misc";
import { OrderListUrlSortField, orderUrl } from "@dashboard/orders/urls";
import { ListProps, RelayToFlat, SortPage } from "@dashboard/types";
import { getArrowDirection } from "@dashboard/utils/sort";
import { TableBody, TableCell, TableFooter, TableHead } from "@material-ui/core";
import { CSSProperties } from "@material-ui/styles";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => {
    const overflowing: CSSProperties = {
      overflow: "hidden",
      textOverflow: "ellipsis",
    };

    return {
      [theme.breakpoints.up("lg")]: {
        colCustomer: {
          width: 220,
        },
        colDate: {},
        colFulfillment: {
          width: 230,
        },
        colNumber: {
          width: 120,
        },
        colPayment: {
          width: 220,
        },
        colTotal: {},
      },
      pill: {
        maxWidth: "100%",
        ...overflowing,
      },
      colCustomer: overflowing,
      colDate: {
        padding: theme.spacing(0, 3),
      },
      colFulfillment: {},
      colNumber: {},
      colPayment: {},
      colTotal: {
        textAlign: "right",
      },
      link: {
        cursor: "pointer",
      },
    };
  },
  { name: "OrderList" },
);

interface OrderListProps extends ListProps, SortPage<OrderListUrlSortField> {
  orders: RelayToFlat<OrderListQuery["orders"]>;
}

const numberOfColumns = 6;

export const OrderList: React.FC<OrderListProps> = props => {
  const { disabled, settings, orders, onUpdateListSettings, onSort, sort } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const orderList = orders
    ? orders.map(order => ({
        ...order,
        paymentStatus: transformPaymentStatus(order.paymentStatus, intl),
        status: transformOrderStatus(order.status, intl),
      }))
    : undefined;
  return (
    <ResponsiveTable>
      <TableHead>
        <TableRowLink>
          <TableCellHeader
            direction={
              sort.sort === OrderListUrlSortField.number ? getArrowDirection(sort.asc) : undefined
            }
            arrowPosition="right"
            onClick={() => onSort(OrderListUrlSortField.number)}
            className={classes.colNumber}
          >
            <FormattedMessage id="kFkPWB" defaultMessage="Number" />
          </TableCellHeader>
          <TableCellHeader
            direction={
              sort.sort === OrderListUrlSortField.date ? getArrowDirection(sort.asc) : undefined
            }
            onClick={() => onSort(OrderListUrlSortField.date)}
            className={classes.colDate}
          >
            <FormattedMessage
              id="PHUcrU"
              defaultMessage="Date"
              description="date when order was placed"
            />
          </TableCellHeader>
          <TableCellHeader
            direction={
              sort.sort === OrderListUrlSortField.customer ? getArrowDirection(sort.asc) : undefined
            }
            onClick={() => onSort(OrderListUrlSortField.customer)}
            className={classes.colCustomer}
          >
            <FormattedMessage
              id="5blVMu"
              defaultMessage="Customer"
              description="e-mail or full name"
            />
          </TableCellHeader>
          <TableCellHeader
            direction={
              sort.sort === OrderListUrlSortField.payment ? getArrowDirection(sort.asc) : undefined
            }
            onClick={() => onSort(OrderListUrlSortField.payment)}
            className={classes.colPayment}
          >
            <FormattedMessage id="p+UDec" defaultMessage="Payment" description="payment status" />
          </TableCellHeader>
          <TableCellHeader
            direction={
              sort.sort === OrderListUrlSortField.fulfillment
                ? getArrowDirection(sort.asc)
                : undefined
            }
            onClick={() => onSort(OrderListUrlSortField.fulfillment)}
            className={classes.colFulfillment}
          >
            <FormattedMessage id="NWxomz" defaultMessage="Fulfillment status" />
          </TableCellHeader>
          <TableCellHeader textAlign="right" className={classes.colTotal}>
            <FormattedMessage id="k9hf7F" defaultMessage="Total" description="total order price" />
          </TableCellHeader>
        </TableRowLink>
      </TableHead>
      <TableFooter>
        <TableRowLink>
          <TablePaginationWithContext
            colSpan={numberOfColumns}
            settings={settings}
            disabled={disabled}
            onUpdateListSettings={onUpdateListSettings}
          />
        </TableRowLink>
      </TableFooter>
      <TableBody>
        {renderCollection(
          orderList,
          order => (
            <TableRowLink
              data-test-id="order-table-row"
              hover={!!order}
              className={order ? classes.link : undefined}
              href={order && orderUrl(order.id)}
              key={order ? order.id : "skeleton"}
            >
              <TableCell className={classes.colNumber}>
                {maybe(() => order.number) ? "#" + order.number : <Skeleton />}
              </TableCell>
              <TableCell className={classes.colDate}>
                {maybe(() => order.created) ? (
                  <DateTime date={order.created} plain />
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
              <TableCell className={classes.colPayment}>
                {maybe(() => order.paymentStatus.status) !== undefined ? (
                  order.paymentStatus.status === null ? null : (
                    <Pill
                      className={classes.pill}
                      color={order.paymentStatus.status}
                      label={order.paymentStatus.localized}
                    />
                  )
                ) : (
                  <Skeleton />
                )}
              </TableCell>
              <TableCell className={classes.colFulfillment}>
                {maybe(() => order.status) ? (
                  <Pill
                    className={classes.pill}
                    color={order.status.status}
                    label={order.status.localized}
                  />
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
          ),
          () => (
            <TableRowLink>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage id="RlfqSV" defaultMessage="No orders found" />
              </TableCell>
            </TableRowLink>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
OrderList.displayName = "OrderList";
export default OrderList;
