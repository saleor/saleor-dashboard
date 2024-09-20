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
import { TECHNICAL_HELP_CTA_URL } from "@dashboard/links";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { HomeAnalyticsCard } from "../HomeAnalyticsCard";
import { HomeHeader } from "../HomeHeader";
import { HomeProductList } from "../HomeProductList";
import { HomePageRightSidebar } from "./HomePageRightSidebar";
import { homePageMessages } from "./messages";

export interface HomePageProps {
  activities: HomeData<Activities>;
  analitics: HomeData<Analitics>;
  topProducts: HomeData<ProductTopToday>;
  notifications: HomeData<Notifications>;
  userName: string;
  noChannel: boolean;
}

const HomePage: React.FC<HomePageProps> = props => {
  const { userName, analitics, topProducts, activities, notifications, noChannel } = props;
  const intl = useIntl();

  return (
    <DetailPageLayout withSavebar={false}>
      <TopNav title={<HomeHeader userName={userName} />} />
      <DetailPageLayout.Content>
        <Box paddingLeft={6} paddingRight={8}>
          <CardSpacer />
          <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
            <Box display="grid" __gridTemplateColumns="repeat(2, 1fr)" gap={5} marginBottom={5}>
              <HomeAnalyticsCard
                title={intl.formatMessage(homePageMessages.salesCardTitle)}
                testId="sales-analytics"
              >
                {noChannel || analitics.hasError ? (
                  0
                ) : !analitics.loading ? (
                  <Money money={analitics.data.sales} />
                ) : (
                  <Skeleton width={10} height={3} />
                )}
              </HomeAnalyticsCard>
              <HomeAnalyticsCard
                title={intl.formatMessage(homePageMessages.outOfStockCardTitle)}
                testId="out-of-stock-analytics"
              >
                {noChannel || notifications.hasError ? (
                  0
                ) : !notifications.loading ? (
                  notifications.data.productsOutOfStock
                ) : (
                  <Skeleton width={16} height={3} />
                )}
              </HomeAnalyticsCard>
            </Box>
          </RequirePermissions>
          <CardSpacer />
          {topProducts && (
            <RequirePermissions
              requiredPermissions={[PermissionEnum.MANAGE_ORDERS, PermissionEnum.MANAGE_PRODUCTS]}
            >
              <HomeProductList testId="top-products" topProducts={topProducts} />
              <CardSpacer />
            </RequirePermissions>
          )}
        </Box>
      </DetailPageLayout.Content>

      <HomePageRightSidebar activities={activities} technicalHelpUrl={TECHNICAL_HELP_CTA_URL} />
    </DetailPageLayout>
  );
};

HomePage.displayName = "HomePage";
export default HomePage;
