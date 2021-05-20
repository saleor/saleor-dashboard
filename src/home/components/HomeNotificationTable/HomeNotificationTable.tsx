import {
  Card,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@material-ui/core";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import RequirePermissions from "@saleor/components/RequirePermissions";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { makeStyles } from "@saleor/theme";
import { UserPermissionProps } from "@saleor/types";
import { PermissionEnum } from "@saleor/types/globalTypes";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  createNewChannel: {
    defaultMessage: "Create new channel"
  },
  noOrders: {
    defaultMessage: "No orders ready to fulfill",
    id: "homeNotificationTableNoOrders"
  },
  noPaymentWaiting: {
    defaultMessage: "No payments waiting for capture",
    id: "homeNotificationsNoPayments"
  },
  noProductsOut: {
    defaultMessage: "No products out of stock",
    id: "homeNotificationsTableNoProducts"
  },
  orderReady: {
    defaultMessage:
      "{amount, plural,one {One order is ready to fulfill} other {{amount} Orders are ready to fulfill}}",
    id: "homeNotificationTableOrders"
  },
  paymentCapture: {
    defaultMessage:
      "{amount, plural,one {One payment to capture}other {{amount} Payments to capture}}",
    id: "homeNotificationTablePayments"
  },
  productOut: {
    defaultMessage:
      "{amount, plural,one {One product out of stock}other {{amount} Products out of stock}}",
    id: "homeNotificationTableProducts"
  }
});

const useStyles = makeStyles(
  () => ({
    arrowIcon: {
      textAlign: "right",
      width: "auto"
    },
    tableCard: {
      overflow: "hidden"
    },
    tableRow: {
      cursor: "pointer"
    }
  }),
  { name: "HomeNotificationTable" }
);

interface HomeNotificationTableProps extends UserPermissionProps {
  ordersToCapture: number;
  ordersToFulfill: number;
  productsOutOfStock: number;
  onCreateNewChannelClick: () => void;
  onOrdersToFulfillClick: () => void;
  onOrdersToCaptureClick: () => void;
  onProductsOutOfStockClick: () => void;
  noChannel: boolean;
}

const HomeNotificationTable: React.FC<HomeNotificationTableProps> = props => {
  const {
    onCreateNewChannelClick,
    onOrdersToCaptureClick,
    onOrdersToFulfillClick,
    onProductsOutOfStockClick,
    ordersToCapture,
    ordersToFulfill,
    productsOutOfStock,
    userPermissions,
    noChannel
  } = props;

  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card className={classes.tableCard}>
      <ResponsiveTable>
        <TableBody className={classes.tableRow}>
          {noChannel && (
            <RequirePermissions
              userPermissions={userPermissions}
              requiredPermissions={[PermissionEnum.MANAGE_CHANNELS]}
            >
              <TableRow hover={true} onClick={onCreateNewChannelClick}>
                <TableCell>
                  <Typography>
                    {intl.formatMessage(messages.createNewChannel)}
                  </Typography>
                </TableCell>
                <TableCell className={classes.arrowIcon}>
                  <KeyboardArrowRight />
                </TableCell>
              </TableRow>
            </RequirePermissions>
          )}
          <RequirePermissions
            userPermissions={userPermissions}
            requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}
          >
            <TableRow hover={true} onClick={onOrdersToFulfillClick}>
              <TableCell data-test-id="orders-to-fulfill">
                {ordersToFulfill === undefined ? (
                  <Skeleton />
                ) : ordersToFulfill === 0 ? (
                  <Typography>
                    {intl.formatMessage(messages.noOrders)}
                  </Typography>
                ) : (
                  <Typography>
                    {intl.formatMessage(messages.orderReady, {
                      amount: <strong>{ordersToFulfill}</strong>
                    })}
                  </Typography>
                )}
              </TableCell>
              <TableCell className={classes.arrowIcon}>
                <KeyboardArrowRight />
              </TableCell>
            </TableRow>
            <TableRow hover={true} onClick={onOrdersToCaptureClick}>
              <TableCell data-test-id="orders-to-capture">
                {ordersToCapture === undefined ? (
                  <Skeleton />
                ) : ordersToCapture === 0 ? (
                  <Typography>
                    {intl.formatMessage(messages.noPaymentWaiting)}
                  </Typography>
                ) : (
                  <Typography>
                    {intl.formatMessage(messages.paymentCapture, {
                      amount: <strong>{ordersToCapture}</strong>
                    })}
                  </Typography>
                )}
              </TableCell>
              <TableCell className={classes.arrowIcon}>
                <KeyboardArrowRight />
              </TableCell>
            </TableRow>
          </RequirePermissions>
          <RequirePermissions
            userPermissions={userPermissions}
            requiredPermissions={[PermissionEnum.MANAGE_PRODUCTS]}
          >
            <TableRow hover={true} onClick={onProductsOutOfStockClick}>
              <TableCell data-test-id="products-out-of-stock">
                {productsOutOfStock === undefined ? (
                  <Skeleton />
                ) : productsOutOfStock === 0 ? (
                  <Typography>
                    {intl.formatMessage(messages.noProductsOut)}
                  </Typography>
                ) : (
                  <Typography>
                    {intl.formatMessage(messages.productOut, {
                      amount: <strong>{productsOutOfStock}</strong>
                    })}
                  </Typography>
                )}
              </TableCell>
              <TableCell className={classes.arrowIcon}>
                <KeyboardArrowRight />
              </TableCell>
            </TableRow>
          </RequirePermissions>
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
HomeNotificationTable.displayName = "HomeNotificationTable";
export default HomeNotificationTable;
