import {
  HomeActivitiesQuery,
  HomeAnaliticsQuery,
  HomeTopProductsQuery,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type Activities = RelayToFlat<
  NonNullable<HomeActivitiesQuery["activities"]>
>;
export type ProductTopToday = RelayToFlat<
  NonNullable<HomeTopProductsQuery["productTopToday"]>
>;

export interface Analitics {
  orders: number | null;
  sales: NonNullable<HomeAnaliticsQuery["salesToday"]>["gross"];
}

export interface Notifications {
  ordersToCapture: number | null;
  ordersToFulfill: number | null;
  productsOutOfStock: number;
}

export interface HomeData<T> {
  data: T;
  loading: boolean;
  hasError: boolean;
}
