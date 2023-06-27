// @ts-strict-ignore
import placeholderImage from "@assets/images/placeholder60x60.png";
import { adminUserPermissions } from "@dashboard/fixtures";
import { PermissionEnum } from "@dashboard/graphql";
import { shop as shopFixture } from "@dashboard/home/fixtures";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";

import { MockedUserProvider } from "../../../../.storybook/helpers";
import HomePageComponent, { HomePageProps } from "./HomePage";

const shop = shopFixture(placeholderImage);

const homePageProps: Omit<HomePageProps, "classes"> = {
  activities: mapEdgesToItems(shop.activities),
  noChannel: false,
  createNewChannelHref: "",
  ordersToFulfillHref: "",
  ordersToCaptureHref: "",
  productsOutOfStockHref: "",
  orders: shop.ordersToday.totalCount,
  ordersToCapture: shop.ordersToCapture.totalCount,
  ordersToFulfill: shop.ordersToFulfill.totalCount,
  productsOutOfStock: shop.productsOutOfStock.totalCount,
  sales: shop.salesToday.gross,
  topProducts: mapEdgesToItems(shop.productTopToday),
  userName: "admin@example.com",
};

const HomePage = props => {
  const customPermissions = props?.customPermissions;

  return (
    <MockedUserProvider customPermissions={customPermissions}>
      <HomePageComponent {...props} />
    </MockedUserProvider>
  );
};

export default {
  title: "Home / Home",
};

export const Default = () => <HomePage {...homePageProps} />;

export const Loading = () => (
  <HomePage
    {...homePageProps}
    activities={undefined}
    orders={undefined}
    ordersToCapture={undefined}
    ordersToFulfill={undefined}
    productsOutOfStock={undefined}
    sales={undefined}
    topProducts={undefined}
    userName={undefined}
  />
);

export const NoData = () => (
  <HomePage {...homePageProps} topProducts={[]} activities={[]} />
);

export const NoPermissions = () => (
  <HomePage {...homePageProps} customPermissions={[]} />
);

export const ProductPermissions = () => (
  <HomePage
    {...homePageProps}
    customPermissions={adminUserPermissions.filter(
      perm => perm.code === PermissionEnum.MANAGE_PRODUCTS,
    )}
  />
);

export const OrderPermissions = () => (
  <HomePage
    {...homePageProps}
    customPermissions={adminUserPermissions.filter(
      perm => perm.code === PermissionEnum.MANAGE_ORDERS,
    )}
  />
);
