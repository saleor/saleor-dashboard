import { ChannelShippingZonesQuery, WarehouseFragment } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type ChannelShippingZones = RelayToFlat<ChannelShippingZonesQuery["shippingZones"]>;

type ChannelShippingZone = NonNullable<ChannelShippingZones>[number];

export type ChannelWarehouses = WarehouseFragment[];

export type ChannelWarehouse = ChannelWarehouses[0];
