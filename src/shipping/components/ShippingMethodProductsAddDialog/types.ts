import { type SearchProductsQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

export type Products = NonNullable<RelayToFlat<SearchProductsQuery["search"]>>;
export type Product = Products[0];
