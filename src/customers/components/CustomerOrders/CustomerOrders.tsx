import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { DateTime } from "@saleor/components/Date";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import { maybe, renderCollection, transformPaymentStatus } from "../../../misc";
import { CustomerDetails_user_orders_edges_node } from "../../types/CustomerDetails";

const styles = createStyles({
  link: {
    cursor: "pointer"
  },
  textRight: {
    textAlign: "right"
  }
});

export interface CustomerOrdersProps extends WithStyles<typeof styles> {
  orders: CustomerDetails_user_orders_edges_node[];
  onViewAllOrdersClick: () => void;
  onRowClick: (id: string) => void;
}

const CustomerOrders = withStyles(styles, { name: "CustomerOrders" })(
  ({
    classes,
    orders,
    onRowClick,
    onViewAllOrdersClick
  }: CustomerOrdersProps) => {
    const intl = useIntl();

    const orderList = orders
      ? orders.map(order => ({
          ...order,
          paymentStatus: transformPaymentStatus(order.paymentStatus, intl)
        }))
      : undefined;
    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Recent Orders",
            description: "section header"
          })}
          toolbar={
            <Button
              variant="text"
              color="primary"
              onClick={onViewAllOrdersClick}
            >
              <FormattedMessage
                defaultMessage="View all orders"
                description="button"
              />
            </Button>
          }
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="dense">
                <FormattedMessage
                  defaultMessage="No. of Order"
                  description="number of order"
                />
              </TableCell>
              <TableCell padding="dense">
                <FormattedMessage
                  defaultMessage="Date"
                  description="order placement date"
                />
              </TableCell>
              <TableCell padding="dense">
                <FormattedMessage
                  defaultMessage="Status"
                  description="order status"
                />
              </TableCell>
              <TableCell className={classes.textRight} padding="dense">
                <FormattedMessage
                  defaultMessage="Total"
                  description="order total amount"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(
              orderList,
              order => (
                <TableRow
                  hover={!!order}
                  className={!!order ? classes.link : undefined}
                  onClick={order ? () => onRowClick(order.id) : undefined}
                  key={order ? order.id : "skeleton"}
                >
                  <TableCell padding="dense">
                    {maybe(() => order.number) ? (
                      "#" + order.number
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell padding="dense">
                    {maybe(() => order.created) ? (
                      <DateTime date={order.created} />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell padding="dense">
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
                  <TableCell className={classes.textRight} padding="dense">
                    {maybe(() => order.total.gross) ? (
                      <Money money={order.total.gross} />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                </TableRow>
              ),
              () => (
                <TableRow>
                  <TableCell colSpan={6}>
                    <FormattedMessage defaultMessage="No orders found" />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Card>
    );
  }
);
CustomerOrders.displayName = "CustomerOrders";
export default CustomerOrders;
