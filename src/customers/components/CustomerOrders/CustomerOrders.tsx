import {
  Button,
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { DateTime } from "@saleor/components/Date";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection, transformPaymentStatus } from "../../../misc";
import { CustomerDetails_user_orders_edges_node } from "../../types/CustomerDetails";

const useStyles = makeStyles(
  {
    link: {
      cursor: "pointer"
    },
    textRight: {
      textAlign: "right"
    }
  },
  { name: "CustomerOrders" }
);

export interface CustomerOrdersProps {
  orders: CustomerDetails_user_orders_edges_node[];
  onViewAllOrdersClick: () => void;
  onRowClick: (id: string) => void;
}

const CustomerOrders: React.FC<CustomerOrdersProps> = props => {
  const { orders, onRowClick, onViewAllOrdersClick } = props;
  const classes = useStyles(props);

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
          id: "1LiVhv",
          defaultMessage: "Recent Orders",
          description: "section header"
        })}
        toolbar={
          <Button variant="text" color="primary" onClick={onViewAllOrdersClick}>
            <FormattedMessage
              id="3+990c"
              defaultMessage="View all orders"
              description="button"
            />
          </Button>
        }
      />
      <ResponsiveTable>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage
                id="nTF6tG"
                defaultMessage="No. of Order"
                description="number of order"
              />
            </TableCell>
            <TableCell>
              <FormattedMessage
                id="ri3kK9"
                defaultMessage="Date"
                description="order placement date"
              />
            </TableCell>
            <TableCell>
              <FormattedMessage
                id="pURrk1"
                defaultMessage="Status"
                description="order status"
              />
            </TableCell>
            <TableCell className={classes.textRight}>
              <FormattedMessage
                id="taX/V3"
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
                <TableCell>
                  {maybe(() => order.number) ? (
                    "#" + order.number
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell>
                  {maybe(() => order.created) ? (
                    <DateTime date={order.created} />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell>
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
                <TableCell className={classes.textRight}>
                  {maybe(() => order.total.gross) ? (
                    <Money money={order.total.gross} align="right" />
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
                    id="RlfqSV"
                    defaultMessage="No orders found"
                  />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

CustomerOrders.displayName = "CustomerOrders";
export default CustomerOrders;
