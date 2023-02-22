import { Content } from "@dashboard/components/AppLayout/Content";
import { DetailedContent } from "@dashboard/components/AppLayout/DetailedContent";
import { RightSidebar } from "@dashboard/components/AppLayout/RightSidebar";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import Money from "@dashboard/components/Money";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import Skeleton from "@dashboard/components/Skeleton";
import { HomeQuery, PermissionEnum } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { makeStyles } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import Orders from "../../../icons/Orders";
import Sales from "../../../icons/Sales";
import HomeActivityCard from "../HomeActivityCard";
import HomeAnalyticsCard from "../HomeAnalyticsCard";
import HomeHeader from "../HomeHeader";
import HomeNotificationTable from "../HomeNotificationTable/HomeNotificationTable";
import HomeProductListCard from "../HomeProductListCard";

const useStyles = makeStyles(
  theme => ({
    cardContainer: {
      display: "grid",
      gridColumnGap: theme.spacing(3),
      gridTemplateColumns: "1fr 1fr",
      [theme.breakpoints.down("sm")]: {
        gridColumnGap: theme.spacing(1),
      },
      [theme.breakpoints.down("xs")]: {
        gridTemplateColumns: "1fr",
      },
    },
    icon: {
      "& path": {
        fill: theme.palette.primary.main,
      },
    },
  }),
  { name: "HomePage" },
);

export interface HomePageProps {
  activities: RelayToFlat<HomeQuery["activities"]>;
  orders: number | null;
  ordersToCapture: number | null;
  ordersToFulfill: number | null;
  productsOutOfStock: number;
  sales: HomeQuery["salesToday"]["gross"];
  topProducts: RelayToFlat<HomeQuery["productTopToday"]> | null;
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

  const classes = useStyles(props);

  return (
    <DetailedContent>
      <TopNav title={<HomeHeader userName={userName} />} />
      <Content noSavebar>
        <Box paddingLeft={9} paddingRight={11}>
          <CardSpacer />
          <RequirePermissions
            requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}
          >
            <div className={classes.cardContainer}>
              <HomeAnalyticsCard
                title={"Sales"}
                testId="sales-analytics"
                icon={
                  <Sales
                    className={classes.icon}
                    fontSize={"inherit"}
                    viewBox="0 0 64 64"
                  />
                }
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
                title={"Orders"}
                testId="orders-analytics"
                icon={
                  <Orders
                    className={classes.icon}
                    fontSize={"inherit"}
                    viewBox="0 0 64 64"
                  />
                }
              >
                {noChannel ? (
                  0
                ) : orders !== undefined ? (
                  orders
                ) : (
                  <Skeleton style={{ width: "5em" }} />
                )}
              </HomeAnalyticsCard>
            </div>
          </RequirePermissions>
          <HomeNotificationTable
            createNewChannelHref={createNewChannelHref}
            ordersToFulfillHref={ordersToFulfillHref}
            ordersToCaptureHref={ordersToCaptureHref}
            productsOutOfStockHref={productsOutOfStockHref}
            ordersToCapture={ordersToCapture}
            ordersToFulfill={ordersToFulfill}
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
              <HomeProductListCard
                testId="top-products"
                topProducts={topProducts}
              />
              <CardSpacer />
            </RequirePermissions>
          )}
        </Box>
      </Content>
      {activities && (
        <RightSidebar noSavebar>
          <RequirePermissions
            requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}
          >
            <HomeActivityCard activities={activities} testId="activity-card" />
          </RequirePermissions>
        </RightSidebar>
      )}
    </DetailedContent>
  );
};
HomePage.displayName = "HomePage";
export default HomePage;
