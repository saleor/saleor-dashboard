import { WithOptional } from "@saleor/misc";
import { WarehouseList_warehouses_edges_node } from "@saleor/warehouses/types/WarehouseList";

export type Warehouse = WithOptional<
  WarehouseList_warehouses_edges_node,
  "shippingZones"
>;
