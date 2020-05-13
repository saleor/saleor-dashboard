import { makeStyles } from "@material-ui/core/styles";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Money from "@saleor/components/Money";
import RequirePermissions from "@saleor/components/RequirePermissions";
import Skeleton from "@saleor/components/Skeleton";
import { UserPermissionProps } from "@saleor/types";
import { PermissionEnum } from "@saleor/types/globalTypes";
import React from "react";

import Orders from "../../../icons/Orders";
import Sales from "../../../icons/Sales";
import {
  Home_activities_edges_node,
  Home_productTopToday_edges_node,
  Home_salesToday_gross
} from "../../types/Home";
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
        gridColumnGap: theme.spacing(1)
      },
      [theme.breakpoints.down("xs")]: {
        gridTemplateColumns: "1fr"
      }
    },
    icon: {
      "& path": {
        fill: theme.palette.primary.main
      }
    }
  }),
  { name: "HomePage" }
);

export interface HomePageProps extends UserPermissionProps {
  activities: Home_activities_edges_node[];
  orders: number;
  ordersToCapture: number;
  ordersToFulfill: number;
  productsOutOfStock: number;
  sales: Home_salesToday_gross;
  topProducts: Home_productTopToday_edges_node[];
  userName: string;
  onOrdersToCaptureClick: () => void;
  onOrdersToFulfillClick: () => void;
  onProductClick: (productId: string, variantId: string) => void;
  onProductsOutOfStockClick: () => void;
}

const HomePage: React.FC<HomePageProps> = props => {
  const {
    userName,
    orders,
    sales,
    topProducts,
    onProductClick,
    activities,
    onOrdersToCaptureClick,
    onOrdersToFulfillClick,
    onProductsOutOfStockClick,
    ordersToCapture,
    ordersToFulfill,
    productsOutOfStock,
    userPermissions
  } = props;

  const classes = useStyles(props);

  return (
    <Container>
      <HomeHeader userName={userName} />
      <CardSpacer />
      <Grid>
        <div>
          <RequirePermissions
            userPermissions={userPermissions}
            requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}
          >
            <div className={classes.cardContainer}>
              <HomeAnalyticsCard
                title={"Sales"}
                icon={
                  <Sales
                    className={classes.icon}
                    fontSize={"inherit"}
                    viewBox="0 0 64 64"
                  />
                }
              >
                {sales ? (
                  <Money money={sales} />
                ) : (
                  <Skeleton style={{ width: "5em" }} />
                )}
              </HomeAnalyticsCard>
              <HomeAnalyticsCard
                title={"Orders"}
                icon={
                  <Orders
                    className={classes.icon}
                    fontSize={"inherit"}
                    viewBox="0 0 64 64"
                  />
                }
              >
                {orders === undefined ? (
                  <Skeleton style={{ width: "5em" }} />
                ) : (
                  orders
                )}
              </HomeAnalyticsCard>
            </div>
          </RequirePermissions>
          <HomeNotificationTable
            onOrdersToCaptureClick={onOrdersToCaptureClick}
            onOrdersToFulfillClick={onOrdersToFulfillClick}
            onProductsOutOfStockClick={onProductsOutOfStockClick}
            ordersToCapture={ordersToCapture}
            ordersToFulfill={ordersToFulfill}
            productsOutOfStock={productsOutOfStock}
            userPermissions={userPermissions}
          />
          <CardSpacer />
          <RequirePermissions
            userPermissions={userPermissions}
            requiredPermissions={[
              PermissionEnum.MANAGE_ORDERS,
              PermissionEnum.MANAGE_PRODUCTS
            ]}
          >
            <HomeProductListCard
              onRowClick={onProductClick}
              topProducts={topProducts}
            />
            <CardSpacer />
          </RequirePermissions>
        </div>
        <div>
          <RequirePermissions
            userPermissions={userPermissions}
            requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}
          >
            <HomeActivityCard activities={activities} />
          </RequirePermissions>
        </div>
      </Grid>
    </Container>
  );
};
HomePage.displayName = "HomePage";
export default HomePage;
