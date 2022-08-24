import { ChannelShippingZonesQuery, WarehouseFragment } from "@saleor/graphql";
import { RelayToFlat } from "@saleor/types";

export type ChannelShippingZones = RelayToFlat<
  ChannelShippingZonesQuery["shippingZones"]
>;

export type ChannelShippingZone = ChannelShippingZones[0];

export type ChannelWarehouses = WarehouseFragment[];

export type ChannelWarehouse = ChannelWarehouses[0];
