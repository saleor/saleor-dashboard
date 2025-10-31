import { address } from "@dashboard/fixtures";
import {
  WarehouseClickAndCollectOptionEnum,
  WarehouseDetailsFragment,
  WarehouseWithShippingFragment,
} from "@dashboard/graphql";

import { shippingZones } from "../shipping/fixtures";

export const warehouseList: WarehouseWithShippingFragment[] = [
  {
    __typename: "Warehouse",
    id: "V2FyZWhvdXNlOmEzMThmMGZlLTcwMmYtNDNjYy1hYmFjLWZmZmMzN2Y3ZTliYw==",
    name: "C our wares",
    shippingZones: {
      __typename: "ShippingZoneCountableConnection",
      edges: shippingZones.map(node => ({
        __typename: "ShippingZoneCountableEdge",
        node,
      })),
    },
  },
  {
    __typename: "Warehouse",
    id: "V2FyZWhvdXNlOjJmN2UyOTlmLWEwMzMtNDhjZS1iYmM5LTFkZDM4NjU2ZjMwYw==",
    name: "Be stocked",
    shippingZones: {
      __typename: "ShippingZoneCountableConnection",
      edges: shippingZones.map(node => ({
        __typename: "ShippingZoneCountableEdge",
        node,
      })),
    },
  },
  {
    __typename: "Warehouse",
    id: "V2FyZWhvdXNlOmM0ZmQ3Nzc0LWZlMjYtNDE1YS1hYjk1LWFlYTFjMjI0NTgwNg==",
    name: "A Warehouse",
    shippingZones: {
      __typename: "ShippingZoneCountableConnection",
      edges: shippingZones.map(node => ({
        __typename: "ShippingZoneCountableEdge",
        node,
      })),
    },
  },
  {
    __typename: "Warehouse",
    id: "V2FyZWhvdXNlOmNlMmNiZDhhLWRkYmQtNDhiNS1hM2UxLTNmZGVkZGI5MWZkMg==",
    name: "Darkwares",
    shippingZones: {
      __typename: "ShippingZoneCountableConnection",
      edges: shippingZones.map(node => ({
        __typename: "ShippingZoneCountableEdge",
        node,
      })),
    },
  },
];

const email = "test@saleor.io";

export const warehouse: WarehouseDetailsFragment = {
  ...warehouseList[0],
  isPrivate: true,
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum.DISABLED,
  address,
  email,
};

export const warehouseForPickup: WarehouseDetailsFragment = {
  ...warehouseList[0],
  isPrivate: false,
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum.ALL,
  address,
  email,
};
