import { ChannelShippingZones } from "@saleor/channels/pages/ChannelDetailsPage/types";
import { SearchShippingZones_search_edges_node } from "@saleor/searches/types/SearchShippingZones";
import { FetchMoreProps } from "@saleor/types";

export interface ShippingZonesProps {
  addShippingZone: (id: string) => void;
  removeShippingZone: (id: string) => void;
  searchShippingZones: (searchPhrase: string) => void;
  fetchMoreShippingZones: FetchMoreProps;
  shippingZones: ChannelShippingZones;
  shippingZonesChoices: SearchShippingZones_search_edges_node[];
}
