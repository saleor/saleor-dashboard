import { type SearchProductsQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

export type Products = RelayToFlat<NonNullable<SearchProductsQuery["search"]>>;
export type ProductChannels = NonNullable<Products[number]["channelListings"]>;
export interface SelectedChannel {
  id: string;
}
