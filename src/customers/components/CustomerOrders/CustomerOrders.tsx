// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import { DateTime } from "@dashboard/components/Date";
import Money from "@dashboard/components/Money";
import { Pill } from "@dashboard/components/Pill";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableRowLink from "@dashboard/components/TableRowLink";
import { CustomerDetailsQuery } from "@dashboard/graphql";
import { orderUrl } from "@dashboard/orders/urls";
import { RelayToFlat } from "@dashboard/types";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection, transformPaymentStatus } from "../../../misc";

const useStyles = makeStyles(
  {
    link: {
      cursor: "pointer",
    },
    textRight: {
      textAlign: "right",
    },
  },
  { name: "CustomerOrders" },
);

export interface CustomerOrdersProps {
  orders: RelayToFlat<CustomerDetailsQuery["user"]["orders"]>;
  viewAllHref: string;
}

const CustomerOrders: React.FC<CustomerOrdersProps> = props => {
  const { orders, viewAllHref } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const orderList = orders
    ? orders.map(order => ({
        ...order,
        paymentStatus: transformPaymentStatus(order.paymentStatus, intl),
      }))
    : undefined;

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "1LiVhv",
            defaultMessage: "Recent Orders",
            description: "section header",
          })}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button variant="tertiary" href={viewAllHref}>
            <FormattedMessage id="3+990c" defaultMessage="View all orders" description="button" />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <ResponsiveTable>
        <TableHead>
          <TableRowLink>
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
              <FormattedMessage id="pURrk1" defaultMessage="Status" description="order status" />
            </TableCell>
            <TableCell className={classes.textRight}>
              <FormattedMessage
                id="taX/V3"
                defaultMessage="Total"
                description="order total amount"
              />
            </TableCell>
          </TableRowLink>
        </TableHead>
        <TableBody>
          {renderCollection(
            orderList,
            order => (
              <TableRowLink
                hover={!!order}
                className={order ? classes.link : undefined}
                href={order && orderUrl(order.id)}
                key={order ? order.id : "skeleton"}
              >
                <TableCell>
                  {maybe(() => order.number) ? "#" + order.number : <Skeleton />}
                </TableCell>
                <TableCell>
                  {maybe(() => order.created) ? (
                    <DateTime date={order.created} plain />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell>
                  {maybe(() => order.paymentStatus.status) !== undefined ? (
                    order.paymentStatus.status === null ? null : (
                      <Pill
                        color={order.paymentStatus.status}
                        label={order.paymentStatus.localized}
                      />
                    )
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.textRight} align="right">
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
                <TableCell colSpan={6}>
                  <FormattedMessage id="RlfqSV" defaultMessage="No orders found" />
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </DashboardCard>
  );
};

CustomerOrders.displayName = "CustomerOrders";
export default CustomerOrders;
