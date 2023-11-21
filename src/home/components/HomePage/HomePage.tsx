import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Money from "@dashboard/components/Money";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import {
  Activities,
  Analitics,
  HomeData,
  Notifications,
  ProductTopToday,
} from "@dashboard/home/types";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { HomeActivityCard } from "../HomeActivityCard";
import { HomeAnalyticsCard } from "../HomeAnalyticsCard";
import { HomeHeader } from "../HomeHeader";
import { HomeNotificationList } from "../HomeNotificationList";
import { HomeProductList } from "../HomeProductList";
import { homePageMessages } from "./messages";

export interface HomePageProps {
  activities: HomeData<Activities>;
  analitics: HomeData<Analitics>;
  topProducts: HomeData<ProductTopToday>;
  notifications: HomeData<Notifications>;
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
    analitics,
    topProducts,
    activities,
    createNewChannelHref,
    ordersToFulfillHref,
    ordersToCaptureHref,
    productsOutOfStockHref,
    notifications,
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
                {noChannel || analitics.hasError ? (
                  0
                ) : !analitics.loading ? (
                  <Money money={analitics.data.sales} />
                ) : (
                  <Skeleton style={{ width: "5em" }} />
                )}
              </HomeAnalyticsCard>
              <HomeAnalyticsCard
                title={intl.formatMessage(homePageMessages.ordersCardTitle)}
                testId="orders-analytics"
              >
                {noChannel || analitics.hasError ? (
                  0
                ) : !analitics.loading ? (
                  analitics.data.orders
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
            notifications={notifications}
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
