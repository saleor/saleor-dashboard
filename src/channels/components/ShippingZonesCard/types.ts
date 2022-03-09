import { ChannelShippingZones } from "@saleor/channels/pages/ChannelDetailsPage/types";
import { SearchShippingZonesQuery } from "@saleor/graphql";
import { FetchMoreProps, RelayToFlat } from "@saleor/types";

export interface ShippingZonesProps {
  addShippingZone: (id: string) => void;
  removeShippingZone: (id: string) => void;
  searchShippingZones: (searchPhrase: string) => void;
  fetchMoreShippingZones: FetchMoreProps;
  shippingZones: ChannelShippingZones;
  shippingZonesChoices: RelayToFlat<SearchShippingZonesQuery["search"]>;
}
