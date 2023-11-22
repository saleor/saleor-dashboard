// @ts-strict-ignore
import placeholderImage from "@assets/images/placeholder60x60.png";
import { adminUserPermissions } from "@dashboard/fixtures";
import { PermissionEnum } from "@dashboard/graphql";
import {
  activities,
  analitics,
  notifications,
  topProducts as topProductsFixture,
} from "@dashboard/home/fixtures";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";

import { MockedUserProvider } from "../../../../.storybook/helpers";
import HomePageComponent, { HomePageProps } from "./HomePage";

const productTopToday = topProductsFixture(placeholderImage);

const homePageProps: Omit<HomePageProps, "classes"> = {
  activities: {
    data: mapEdgesToItems(activities),
    loading: false,
    hasError: false,
  },
  notifications: {
    data: {
      productsOutOfStock: notifications.productsOutOfStock.totalCount,
    },
    loading: false,
    hasError: false,
  },
  analitics: {
    data: {
      sales: analitics.salesToday.gross,
    },
    loading: false,
    hasError: false,
  },
  noChannel: false,
  topProducts: {
    data: mapEdgesToItems(productTopToday),
    loading: false,
    hasError: false,
  },
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
    activities={{
      data: [],
      loading: true,
      hasError: false,
    }}
    notifications={{
      data: {},
      loading: true,
      hasError: false,
    }}
    analitics={{
      data: {},
      loading: true,
      hasError: false,
    }}
    topProducts={{
      data: [],
      loading: true,
      hasError: false,
    }}
  />
);

export const Error = () => (
  <HomePage
    {...homePageProps}
    activities={{
      data: [],
      loading: false,
      hasError: true,
    }}
    notifications={{
      data: {},
      loading: false,
      hasError: true,
    }}
    analitics={{
      data: {},
      loading: false,
      hasError: true,
    }}
    topProducts={{
      data: [],
      loading: false,
      hasError: true,
    }}
  />
);

export const NoData = () => (
  <HomePage
    {...homePageProps}
    topProducts={{
      data: [],
      loading: false,
      hasError: false,
    }}
    activities={{
      data: [],
      loading: false,
      hasError: false,
    }}
  />
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
