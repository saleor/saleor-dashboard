import RequirePermissions from "@dashboard/components/RequirePermissions";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableRowLink from "@dashboard/components/TableRowLink";
import { PermissionEnum } from "@dashboard/graphql";
import {
  Card,
  CardContent,
  TableBody,
  TableCell,
  Typography,
} from "@material-ui/core";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { homeNotificationTableMessages as messages } from "./messages";

const useStyles = makeStyles(
  () => ({
    arrowIcon: {
      textAlign: "right",
      width: 100,
    },
    tableCard: {
      overflow: "hidden",
    },
    tableRow: {
      cursor: "pointer",
    },
    tableCell: {
      paddingLeft: "0 !important",
    },
    cardContent: {
      padding: 0,
    },
  }),
  { name: "HomeNotificationTable" },
);

interface HomeNotificationTableProps {
  ordersToCapture: number;
  ordersToFulfill: number;
  productsOutOfStock: number;
  createNewChannelHref: string;
  ordersToFulfillHref: string;
  ordersToCaptureHref: string;
  productsOutOfStockHref: string;
  noChannel: boolean;
}

const HomeNotificationTable: React.FC<HomeNotificationTableProps> = props => {
  const {
    createNewChannelHref,
    ordersToFulfillHref,
    ordersToCaptureHref,
    productsOutOfStockHref,
    ordersToCapture,
    ordersToFulfill,
    productsOutOfStock,
    noChannel,
  } = props;

  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card className={classes.tableCard}>
      <CardContent className={classes.cardContent}>
        <ResponsiveTable>
          <TableBody className={classes.tableRow}>
            {noChannel && (
              <RequirePermissions
                requiredPermissions={[PermissionEnum.MANAGE_CHANNELS]}
              >
                <TableRowLink hover={true} href={createNewChannelHref}>
                  <TableCell>
                    <Typography>
                      {intl.formatMessage(messages.createNewChannel)}
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.arrowIcon}>
                    <KeyboardArrowRight />
                  </TableCell>
                </TableRowLink>
              </RequirePermissions>
            )}
            <RequirePermissions
              requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}
            >
              <TableRowLink hover={true} href={ordersToFulfillHref}>
                <TableCell
                  data-test-id="orders-to-fulfill"
                  className={classes.tableCell}
                >
                  {ordersToFulfill === undefined ? (
                    <Skeleton />
                  ) : ordersToFulfill === 0 ? (
                    <Typography>
                      {intl.formatMessage(messages.noOrders)}
                    </Typography>
                  ) : (
                    <Typography>
                      {intl.formatMessage(messages.orderReady, {
                        amount: <strong>{ordersToFulfill}</strong>,
                      })}
                    </Typography>
                  )}
                </TableCell>
                <TableCell className={classes.arrowIcon}>
                  <KeyboardArrowRight />
                </TableCell>
              </TableRowLink>
              <TableRowLink hover={true} href={ordersToCaptureHref}>
                <TableCell
                  data-test-id="orders-to-capture"
                  className={classes.tableCell}
                >
                  {ordersToCapture === undefined ? (
                    <Skeleton />
                  ) : ordersToCapture === 0 ? (
                    <Typography>
                      {intl.formatMessage(messages.noPaymentWaiting)}
                    </Typography>
                  ) : (
                    <Typography>
                      {intl.formatMessage(messages.paymentCapture, {
                        amount: <strong>{ordersToCapture}</strong>,
                      })}
                    </Typography>
                  )}
                </TableCell>
                <TableCell className={classes.arrowIcon}>
                  <KeyboardArrowRight />
                </TableCell>
              </TableRowLink>
            </RequirePermissions>
            <RequirePermissions
              requiredPermissions={[PermissionEnum.MANAGE_PRODUCTS]}
            >
              <TableRowLink hover={true} href={productsOutOfStockHref}>
                <TableCell
                  data-test-id="products-out-of-stock"
                  className={classes.tableCell}
                >
                  {productsOutOfStock === undefined ? (
                    <Skeleton />
                  ) : productsOutOfStock === 0 ? (
                    <Typography>
                      {intl.formatMessage(messages.noProductsOut)}
                    </Typography>
                  ) : (
                    <Typography>
                      {intl.formatMessage(messages.productOut, {
                        amount: <strong>{productsOutOfStock}</strong>,
                      })}
                    </Typography>
                  )}
                </TableCell>
                <TableCell className={classes.arrowIcon}>
                  <KeyboardArrowRight />
                </TableCell>
              </TableRowLink>
            </RequirePermissions>
          </TableBody>
        </ResponsiveTable>
      </CardContent>
    </Card>
  );
};
HomeNotificationTable.displayName = "HomeNotificationTable";
export default HomeNotificationTable;
