import { WarehouseListQuery } from "@saleor/graphql";
import { WithOptional } from "@saleor/misc";
import { RelayToFlat } from "@saleor/types";

export type Warehouse = WithOptional<
  RelayToFlat<WarehouseListQuery["warehouses"]>[0],
  "shippingZones"
>;
