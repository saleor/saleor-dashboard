import { SearchProductsQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type Products = NonNullable<RelayToFlat<SearchProductsQuery["search"]>>;
export type Product = Products[0];
