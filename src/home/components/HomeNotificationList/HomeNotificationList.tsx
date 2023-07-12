import RequirePermissions from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { List } from "@saleor/macaw-ui/next";
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
          {getOrderToFulfillText(ordersToFulfill, intl)}
        </HomeNotificationListItem>

        <HomeNotificationListItem
          linkUrl={ordersToCaptureHref}
          dataTestId="orders-to-capture"
        >
          {getOrdersToCaptureText(ordersToCapture, intl)}
        </HomeNotificationListItem>
      </RequirePermissions>

      <RequirePermissions
        requiredPermissions={[PermissionEnum.MANAGE_PRODUCTS]}
      >
        <HomeNotificationListItem
          linkUrl={productsOutOfStockHref}
          dataTestId="products-out-of-stock"
        >
          {getProductsOutOfStockText(productsOutOfStock, intl)}
        </HomeNotificationListItem>
      </RequirePermissions>
    </List>
  );
};
