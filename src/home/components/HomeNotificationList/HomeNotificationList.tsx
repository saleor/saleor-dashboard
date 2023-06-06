import RequirePermissions from "@dashboard/components/RequirePermissions";
import Skeleton from "@dashboard/components/Skeleton";
import { PermissionEnum } from "@dashboard/graphql";
import { List } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import { HomeNotificationListItem } from "./HomeNotificationListItem";
import { homeNotificationTableMessages as messages } from "./messages";

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

export const HomeNotificationList = ({
  createNewChannelHref,
  ordersToFulfillHref,
  ordersToCaptureHref,
  productsOutOfStockHref,
  ordersToCapture,
  ordersToFulfill,
  productsOutOfStock,
  noChannel,
}: HomeNotificationTableProps) => {
  const intl = useIntl();

  const getOrderTpFullfillText = () => {
    if (ordersToFulfill === undefined) {
      return <Skeleton />;
    }

    if (ordersToFulfill === 0) {
      return intl.formatMessage(messages.noOrders);
    }

    return intl.formatMessage(messages.orderReady, {
      amount: <strong>{ordersToFulfill}</strong>,
    });
  };

  const getOrdersToCaptureText = () => {
    if (ordersToCapture === undefined) {
      return <Skeleton />;
    }

    if (ordersToCapture === 0) {
      return intl.formatMessage(messages.noPaymentWaiting);
    }

    return intl.formatMessage(messages.paymentCapture, {
      amount: <strong>{ordersToCapture}</strong>,
    });
  };

  const getProductsOutOfStockText = () => {
    if (productsOutOfStock === undefined) {
      return <Skeleton />;
    }

    if (productsOutOfStock === 0) {
      return intl.formatMessage(messages.noProductsOut);
    }

    return intl.formatMessage(messages.productOut, {
      amount: <strong>{productsOutOfStock}</strong>,
    });
  };

  return (
    <List>
      {noChannel && (
        <RequirePermissions
          requiredPermissions={[PermissionEnum.MANAGE_CHANNELS]}
        >
          <HomeNotificationListItem linkUrl={createNewChannelHref}>
            {intl.formatMessage(messages.createNewChannel)}
          </HomeNotificationListItem>
        </RequirePermissions>
      )}

      <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
        <HomeNotificationListItem
          linkUrl={ordersToFulfillHref}
          dataTestId="orders-to-fulfill"
        >
          {getOrderTpFullfillText()}
        </HomeNotificationListItem>

        <HomeNotificationListItem
          linkUrl={ordersToCaptureHref}
          dataTestId="orders-to-capture"
        >
          {getOrdersToCaptureText()}
        </HomeNotificationListItem>
      </RequirePermissions>

      <RequirePermissions
        requiredPermissions={[PermissionEnum.MANAGE_PRODUCTS]}
      >
        <HomeNotificationListItem
          linkUrl={productsOutOfStockHref}
          dataTestId="products-out-of-stock"
        >
          {getProductsOutOfStockText()}
        </HomeNotificationListItem>
      </RequirePermissions>
    </List>
  );
};
