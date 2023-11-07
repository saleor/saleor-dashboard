import RequirePermissions from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { HomeData, Notifications } from "@dashboard/home/types";
import { List } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { HomeNotificationListItem } from "./HomeNotificationListItem";
import { homeNotificationTableMessages as messages } from "./messages";
import {
  getOrdersToCaptureText,
  getOrderToFulfillText,
  getProductsOutOfStockText,
} from "./utils";

interface HomeNotificationTableProps {
  notifications: HomeData<Notifications>;
  createNewChannelHref: string;
  ordersToFulfillHref: string;
  ordersToCaptureHref: string;
  productsOutOfStockHref: string;
  noChannel: boolean;
}

export const HomeNotificationList = ({
  notifications,
  createNewChannelHref,
  ordersToFulfillHref,
  ordersToCaptureHref,
  productsOutOfStockHref,

  noChannel,
}: HomeNotificationTableProps) => {
  const intl = useIntl();

  if (notifications.hasError) {
    return null;
  }

  return (
    <List>
      {noChannel && (
        <RequirePermissions
          requiredPermissions={[PermissionEnum.MANAGE_CHANNELS]}
        >
          <HomeNotificationListItem
            loading={notifications.loading}
            linkUrl={createNewChannelHref}
          >
            {intl.formatMessage(messages.createNewChannel)}
          </HomeNotificationListItem>
        </RequirePermissions>
      )}

      <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
        <HomeNotificationListItem
          loading={notifications.loading}
          linkUrl={ordersToFulfillHref}
          dataTestId="orders-to-fulfill"
        >
          {getOrderToFulfillText(notifications.data.ordersToFulfill ?? 0, intl)}
        </HomeNotificationListItem>

        <HomeNotificationListItem
          loading={notifications.loading}
          linkUrl={ordersToCaptureHref}
          dataTestId="orders-to-capture"
        >
          {getOrdersToCaptureText(
            notifications.data.ordersToCapture ?? 0,
            intl,
          )}
        </HomeNotificationListItem>
      </RequirePermissions>

      <RequirePermissions
        requiredPermissions={[PermissionEnum.MANAGE_PRODUCTS]}
      >
        <HomeNotificationListItem
          loading={notifications.loading}
          linkUrl={productsOutOfStockHref}
          dataTestId="products-out-of-stock"
        >
          {getProductsOutOfStockText(
            notifications.data.productsOutOfStock ?? 0,
            intl,
          )}
        </HomeNotificationListItem>
      </RequirePermissions>
    </List>
  );
};
