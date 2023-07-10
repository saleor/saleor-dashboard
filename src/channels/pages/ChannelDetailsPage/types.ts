// @ts-strict-ignore
import {
  ChannelShippingZonesQuery,
  WarehouseFragment,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type ChannelShippingZones = RelayToFlat<
  ChannelShippingZonesQuery["shippingZones"]
>;

export type ChannelShippingZone = ChannelShippingZones[0];

export type ChannelWarehouses = WarehouseFragment[];

export type ChannelWarehouse = ChannelWarehouses[0];
