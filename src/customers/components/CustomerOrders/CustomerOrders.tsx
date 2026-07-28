import { DashboardCard } from "@dashboard/components/Card";
import { DateTime } from "@dashboard/components/Date/DateTime";
import Money from "@dashboard/components/Money";
import { Placeholder } from "@dashboard/components/Placeholder";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { type CustomerDetailsQuery } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { OrderPaymentStatusPill } from "@dashboard/orders/components/OrderPaymentSummaryCard/components/OrderPaymentStatusPill";
import { orderUrl } from "@dashboard/orders/urls";
import { type RelayToFlat } from "@dashboard/types";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { Box, Button, Skeleton, sprinkles, Text, Tooltip } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Info } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import styles from "./CustomerOrders.module.css";

const textRightStyle = sprinkles({
  textAlign: "right",
});

const NetColumnHeader = (): JSX.Element => {
  const intl = useIntl();

  return (
    <Box className={styles.amountHeaderContent}>
      <FormattedMessage
        id="QcXdj6"
        defaultMessage="Net"
        description="customer recent orders table column: net product sales after discounts"
      />
      <Tooltip>
        <Tooltip.Trigger>
          <Box
            as="button"
            type="button"
            display="flex"
            alignItems="center"
            cursor="pointer"
            padding={0}
            borderWidth={0}
            backgroundColor="transparent"
            aria-label={intl.formatMessage({
              id: "02j7gU",
              defaultMessage: "Net order value explanation",
              description: "customer recent orders table, net column tooltip aria label",
            })}
            data-test-id="customer-orders-net-hint"
            onClick={event => event.stopPropagation()}
          >
            <Info size={13} />
          </Box>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" className={styles.tooltipContent}>
          <Tooltip.Arrow />
          <Text size={2} color="default1">
            <FormattedMessage
              id="wPhgkN"
              defaultMessage="Product revenue after discounts. Excludes shipping and tax. Matches the net sales figures in the overview above."
              description="customer recent orders table, net column tooltip"
            />
          </Text>
        </Tooltip.Content>
      </Tooltip>
    </Box>
  );
};

interface CustomerOrdersProps {
  orders: RelayToFlat<NonNullable<NonNullable<CustomerDetailsQuery["user"]>["orders"]>>;
  viewAllHref: string;
}

const CustomerOrders = (props: CustomerOrdersProps) => {
  const { orders, viewAllHref } = props;
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title size={6} fontWeight="medium">
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
      <DashboardCard.Content>
        {orders === undefined ? (
          <Skeleton />
        ) : orders.length === 0 ? (
          <Placeholder>
            <FormattedMessage id="RlfqSV" defaultMessage="No orders found" />
          </Placeholder>
        ) : (
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
                  <FormattedMessage
                    id="pURrk1"
                    defaultMessage="Status"
                    description="order status"
                  />
                </TableCell>
                <TableCell className={styles.amountHeaderCell} align="right">
                  <NetColumnHeader />
                </TableCell>
                <TableCell
                  className={clsx(styles.amountHeaderCell, styles.lastAmountCell)}
                  align="right"
                >
                  <FormattedMessage
                    id="DGgIIw"
                    defaultMessage="Gross"
                    description="customer recent orders table column: checkout total including shipping and tax"
                  />
                </TableCell>
              </TableRowLink>
            </TableHead>
            <TableBody>
              {renderCollection(orders, order => (
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
                    {order?.subtotal?.net ? <Money money={order.subtotal.net} /> : <Skeleton />}
                  </TableCell>
                  <TableCell className={clsx(textRightStyle, styles.lastAmountCell)} align="right">
                    {order?.total.gross ? <Money money={order.total.gross} /> : <Skeleton />}
                  </TableCell>
                </TableRowLink>
              ))}
            </TableBody>
          </ResponsiveTable>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomerOrders.displayName = "CustomerOrders";
export default CustomerOrders;
