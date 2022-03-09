import { ChannelShippingZonesQuery } from "@saleor/graphql";
import { RelayToFlat } from "@saleor/types";

export type ChannelShippingZones = RelayToFlat<
  ChannelShippingZonesQuery["shippingZones"]
>;

export type ChannelShippingZone = ChannelShippingZones[0];
