import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import { DateTime } from "@saleor/components/Date";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import {
  maybe,
  renderCollection,
  transformOrderStatus,
  transformPaymentStatus
} from "@saleor/misc";
import { ListActions, ListProps } from "@saleor/types";
import { OrderList_orders_edges_node } from "../../types/OrderList";

const styles = (theme: Theme) =>
  createStyles({
    [theme.breakpoints.up("lg")]: {
      colCustomer: {
        width: 220
      },
      colDate: {},
      colFulfillment: {
        width: 230
      },
      colNumber: {
        width: 120
      },
      colPayment: {
        width: 220
      },
      colTotal: {}
    },
    colCustomer: {},
    colDate: {},
    colFulfillment: {},
    colNumber: {},
    colPayment: {},
    colTotal: {
      textAlign: "right"
    },
    link: {
      cursor: "pointer"
    }
  });

interface OrderListProps
  extends ListProps,
    ListActions,
    WithStyles<typeof styles> {
  orders: OrderList_orders_edges_node[];
}

const numberOfColumns = 7;

export const OrderList = withStyles(styles, { name: "OrderList" })(
  ({
    classes,
    disabled,
    settings,
    orders,
    pageInfo,
    onPreviousPage,
    onNextPage,
    onUpdateListSettings,
    onRowClick,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar
  }: OrderListProps) => {
    const intl = useIntl();

    const orderList = orders
      ? orders.map(order => ({
          ...order,
          paymentStatus: transformPaymentStatus(order.paymentStatus, intl),
          status: transformOrderStatus(order.status, intl)
        }))
      : undefined;
    return (
      <Table>
        <TableHead
          colSpan={numberOfColumns}
          selected={selected}
          disabled={disabled}
          items={orders}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <TableCell padding="dense" className={classes.colNumber}>
            <FormattedMessage defaultMessage="No. of Order" />
          </TableCell>
          <TableCell padding="dense" className={classes.colDate}>
            <FormattedMessage
              defaultMessage="Date"
              description="date when order was placed"
            />
          </TableCell>
          <TableCell padding="dense" className={classes.colCustomer}>
            <FormattedMessage
              defaultMessage="Customer"
              description="e-mail or full name"
            />
          </TableCell>
          <TableCell padding="dense" className={classes.colPayment}>
            <FormattedMessage
              defaultMessage="Payment"
              description="payment status"
            />
          </TableCell>
          <TableCell padding="dense" className={classes.colFulfillment}>
            <FormattedMessage defaultMessage="Fulfillment status" />
          </TableCell>
          <TableCell className={classes.colTotal} padding="dense">
            <FormattedMessage
              defaultMessage="Total"
              description="total order price"
            />
          </TableCell>
        </TableHead>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={numberOfColumns}
              settings={settings}
              hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
              onNextPage={onNextPage}
              onUpdateListSettings={onUpdateListSettings}
              hasPreviousPage={
                pageInfo && !disabled ? pageInfo.hasPreviousPage : false
              }
              onPreviousPage={onPreviousPage}
            />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            orderList,
            order => {
              const isSelected = order ? isChecked(order.id) : false;

              return (
                <TableRow
                  hover={!!order}
                  className={!!order ? classes.link : undefined}
                  onClick={order ? onRowClick(order.id) : undefined}
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
                  <TableCell padding="dense" className={classes.colNumber}>
                    {maybe(() => order.number) ? (
                      "#" + order.number
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell padding="dense" className={classes.colDate}>
                    {maybe(() => order.created) ? (
                      <DateTime date={order.created} />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell padding="dense" className={classes.colCustomer}>
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
                  <TableCell padding="dense" className={classes.colPayment}>
                    {maybe(() => order.paymentStatus.status) !== undefined ? (
                      order.paymentStatus.status === null ? null : (
                        <StatusLabel
                          status={order.paymentStatus.status}
                          label={order.paymentStatus.localized}
                        />
                      )
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell padding="dense" className={classes.colFulfillment}>
                    {maybe(() => order.status) ? (
                      <StatusLabel
                        status={order.status.status}
                        label={order.status.localized}
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colTotal} padding="dense">
                    {maybe(() => order.total.gross) ? (
                      <Money money={order.total.gross} />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage defaultMessage="No orders found" />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    );
  }
);
OrderList.displayName = "OrderList";
export default OrderList;
