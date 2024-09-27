import { ChannelShippingZonesQuery, WarehouseFragment } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type ChannelShippingZones = RelayToFlat<ChannelShippingZonesQuery["shippingZones"]>;

export type ChannelWarehouses = WarehouseFragment[];
