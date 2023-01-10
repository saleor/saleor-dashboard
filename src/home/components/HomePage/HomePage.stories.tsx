import placeholderImage from "@assets/images/placeholder60x60.png";
import { adminUserPermissions } from "@saleor/fixtures";
import { PermissionEnum } from "@saleor/graphql";
import { shop as shopFixture } from "@saleor/home/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { MockedUserProvider } from "@saleor/storybook/MockedUserProvider";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { storiesOf } from "@storybook/react";
import React from "react";

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

storiesOf("Home", module)
  .addDecorator(Decorator)
  .add("default", () => <HomePage {...homePageProps} />)
  .add("loading", () => (
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
  ))
  .add("no data", () => (
    <HomePage {...homePageProps} topProducts={[]} activities={[]} />
  ))
  .add("no permissions", () => (
    <HomePage {...homePageProps} customPermissions={[]} />
  ))
  .add("product permissions", () => (
    <HomePage
      {...homePageProps}
      customPermissions={adminUserPermissions.filter(
        perm => perm.code === PermissionEnum.MANAGE_PRODUCTS,
      )}
    />
  ))
  .add("order permissions", () => (
    <HomePage
      {...homePageProps}
      customPermissions={adminUserPermissions.filter(
        perm => perm.code === PermissionEnum.MANAGE_ORDERS,
      )}
    />
  ));
