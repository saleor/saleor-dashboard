import { type ChannelShippingZonesQuery, type WarehouseFragment } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

export type ChannelShippingZones = RelayToFlat<ChannelShippingZonesQuery["shippingZones"]>;

export type ChannelWarehouses = WarehouseFragment[];

export type ChannelWarehouse = ChannelWarehouses[0];
