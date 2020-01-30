import { shippingZones } from "../shipping/fixtures";
import { WarehouseList_warehouses_edges_node } from "./types/WarehouseList";

export const warehouseList: WarehouseList_warehouses_edges_node[] = [
  {
    __typename: "Warehouse",
    id: "V2FyZWhvdXNlOmEzMThmMGZlLTcwMmYtNDNjYy1hYmFjLWZmZmMzN2Y3ZTliYw==",
    name: "C our wares",
    shippingZones: {
      __typename: "ShippingZoneCountableConnection",
      edges: shippingZones.map(node => ({
        __typename: "ShippingZoneCountableEdge",
        node
      }))
    }
  },
  {
    __typename: "Warehouse",
    id: "V2FyZWhvdXNlOjJmN2UyOTlmLWEwMzMtNDhjZS1iYmM5LTFkZDM4NjU2ZjMwYw==",
    name: "Be stocked",
    shippingZones: {
      __typename: "ShippingZoneCountableConnection",
      edges: shippingZones.map(node => ({
        __typename: "ShippingZoneCountableEdge",
        node
      }))
    }
  },
  {
    __typename: "Warehouse",
    id: "V2FyZWhvdXNlOmM0ZmQ3Nzc0LWZlMjYtNDE1YS1hYjk1LWFlYTFjMjI0NTgwNg==",
    name: "A Warehouse",
    shippingZones: {
      __typename: "ShippingZoneCountableConnection",
      edges: shippingZones.map(node => ({
        __typename: "ShippingZoneCountableEdge",
        node
      }))
    }
  },
  {
    __typename: "Warehouse",
    id: "V2FyZWhvdXNlOmNlMmNiZDhhLWRkYmQtNDhiNS1hM2UxLTNmZGVkZGI5MWZkMg==",
    name: "Darkwares",
    shippingZones: {
      __typename: "ShippingZoneCountableConnection",
      edges: shippingZones.map(node => ({
        __typename: "ShippingZoneCountableEdge",
        node
      }))
    }
  }
];
