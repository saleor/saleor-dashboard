import { DashboardCard } from "@dashboard/components/Card";
import { DateTime } from "@dashboard/components/Date";
import Money from "@dashboard/components/Money";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { CustomerDetailsQuery } from "@dashboard/graphql";
import { OrderPaymentStatusPill } from "@dashboard/orders/components/OrderPaymentSummaryCard/components/OrderPaymentStatusPill";
import { orderUrl } from "@dashboard/orders/urls";
import { RelayToFlat } from "@dashboard/types";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { Button, Skeleton, sprinkles } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { renderCollection } from "../../../misc";

const textRightStyle = sprinkles({
  textAlign: "right",
});

export interface CustomerOrdersProps {
  orders: RelayToFlat<NonNullable<NonNullable<CustomerDetailsQuery["user"]>["orders"]>>;
  viewAllHref: string;
}

const CustomerOrders: React.FC<CustomerOrdersProps> = props => {
  const { orders, viewAllHref } = props;
  const intl = useIntl();

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
          <Link to={viewAllHref}>
            <Button variant="secondary">
              <FormattedMessage id="3+990c" defaultMessage="View all orders" description="button" />
            </Button>
          </Link>
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
            <TableCell className={textRightStyle}>
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
            orders,
            order => (
              <TableRowLink
                hover={!!order}
                className={
                  order
                    ? sprinkles({
                        cursor: "pointer",
                      })
                    : undefined
                }
                href={order && orderUrl(order.id)}
                key={order ? order.id : "skeleton"}
              >
                <TableCell>{order?.number ? "#" + order.number : <Skeleton />}</TableCell>
                <TableCell>
                  {order?.created ? <DateTime date={order.created} plain /> : <Skeleton />}
                </TableCell>
                <TableCell>
                  {order ? <OrderPaymentStatusPill order={order} /> : <Skeleton />}
                </TableCell>
                <TableCell className={textRightStyle} align="right">
                  {order?.total.gross ? <Money money={order.total.gross} /> : <Skeleton />}
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
