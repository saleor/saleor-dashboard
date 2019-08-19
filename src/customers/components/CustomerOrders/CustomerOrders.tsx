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
          paymentStatus: transformPaymentStatus(order.paymentStatus)
        }))
      : undefined;
    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Recent orders",
            description: "section header",
            id: "customerOrdersHeader"
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
                id="customerOrdersViewAllOrders"
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
                  description="customer's order list: number of order column header"
                  id="customerOrdersNoOfOrderColumnHeader"
                />
              </TableCell>
              <TableCell padding="dense">
                <FormattedMessage
                  defaultMessage="Date"
                  description="customer's order list: order date column header"
                  id="customerOrdersDateColumnHeader"
                />
              </TableCell>
              <TableCell padding="dense">
                <FormattedMessage
                  defaultMessage="Status"
                  description="customer's order list: status column header"
                  id="customerOrdersStatusColumnHeader"
                />
              </TableCell>
              <TableCell className={classes.textRight} padding="dense">
                <FormattedMessage
                  defaultMessage="Total"
                  description="customer's order list: total amount column header"
                  id="customerOrdersTotalColumnHeader"
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
                    <FormattedMessage
                      defaultMessage="No orders found"
                      id="customerOrdersNoOrders"
                    />
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
