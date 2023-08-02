import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Money from "@dashboard/components/Money";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import Skeleton from "@dashboard/components/Skeleton";
import { HomeQuery, PermissionEnum } from "@dashboard/graphql";
import { Activities, ProductTopToday } from "@dashboard/home/types";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import { HomeActivityCard } from "../HomeActivityCard";
import { HomeAnalyticsCard } from "../HomeAnalyticsCard";
import { HomeHeader } from "../HomeHeader";
import { HomeNotificationList } from "../HomeNotificationList";
import { HomeProductList } from "../HomeProductList";
import { homePageMessages } from "./messages";

export interface HomePageProps {
  activities: Activities;
  orders: number | null;
  ordersToCapture: number | null;
  ordersToFulfill: number | null;
  productsOutOfStock: number;
  sales: NonNullable<HomeQuery["salesToday"]>["gross"];
  topProducts: ProductTopToday | null;
  userName: string;
  createNewChannelHref: string;
  ordersToFulfillHref: string;
  ordersToCaptureHref: string;
  productsOutOfStockHref: string;
  noChannel: boolean;
}

const HomePage: React.FC<HomePageProps> = props => {
  const {
    userName,
    orders,
    sales,
    topProducts,
    activities,
    createNewChannelHref,
    ordersToFulfillHref,
    ordersToCaptureHref,
    productsOutOfStockHref,
    ordersToCapture = 0,
    ordersToFulfill = 0,
    productsOutOfStock = 0,
    noChannel,
  } = props;
  const intl = useIntl();

  return (
    <DetailPageLayout withSavebar={false}>
      <TopNav title={<HomeHeader userName={userName} />} />
      <DetailPageLayout.Content>
        <Box paddingLeft={6} paddingRight={8}>
          <CardSpacer />
          <RequirePermissions
            requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}
          >
            <Box
              display="grid"
              __gridTemplateColumns="repeat(2, 1fr)"
              gap={5}
              marginBottom={5}
            >
              <HomeAnalyticsCard
                title={intl.formatMessage(homePageMessages.salesCardTitle)}
                testId="sales-analytics"
              >
                {noChannel ? (
                  0
                ) : sales ? (
                  <Money money={sales} />
                ) : (
                  <Skeleton style={{ width: "5em" }} />
                )}
              </HomeAnalyticsCard>
              <HomeAnalyticsCard
                title={intl.formatMessage(homePageMessages.ordersCardTitle)}
                testId="orders-analytics"
              >
                {noChannel ? (
                  0
                ) : orders !== undefined ? (
                  orders
                ) : (
                  <Skeleton style={{ width: "5em" }} />
                )}
              </HomeAnalyticsCard>
            </Box>
          </RequirePermissions>
          <HomeNotificationList
            createNewChannelHref={createNewChannelHref}
            ordersToFulfillHref={ordersToFulfillHref}
            ordersToCaptureHref={ordersToCaptureHref}
            productsOutOfStockHref={productsOutOfStockHref}
            ordersToCapture={ordersToCapture ?? 0}
            ordersToFulfill={ordersToFulfill ?? 0}
            productsOutOfStock={productsOutOfStock}
            noChannel={noChannel}
          />
          <CardSpacer />
          {topProducts && (
            <RequirePermissions
              requiredPermissions={[
                PermissionEnum.MANAGE_ORDERS,
                PermissionEnum.MANAGE_PRODUCTS,
              ]}
            >
              <HomeProductList
                testId="top-products"
                topProducts={topProducts}
              />
              <CardSpacer />
            </RequirePermissions>
          )}
        </Box>
      </DetailPageLayout.Content>
      {activities && (
        <DetailPageLayout.RightSidebar>
          <RequirePermissions
            requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}
          >
            <HomeActivityCard activities={activities} testId="activity-card" />
          </RequirePermissions>
        </DetailPageLayout.RightSidebar>
      )}
    </DetailPageLayout>
  );
};
HomePage.displayName = "HomePage";
export default HomePage;
