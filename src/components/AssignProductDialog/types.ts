import { SearchProductsQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type Products = RelayToFlat<SearchProductsQuery["search"]>;
export type ProductChannels = Products[number]["channelListings"];
export interface SelectedChannel {
  id: string;
}
