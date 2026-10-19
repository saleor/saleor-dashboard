import { address } from "@dashboard/fixtures";
import {
  WarehouseClickAndCollectOptionEnum,
  type WarehouseDetailsFragment,
  type WarehouseListItemFragment,
} from "@dashboard/graphql";

import { shippingZones } from "../shipping/fixtures";

const listAddress = {
  __typename: "Address" as const,
  id: address.id,
  city: address.city,
  country: address.country,
};

export const warehouseList: WarehouseListItemFragment[] = [
  {
    __typename: "Warehouse",
    id: "V2FyZWhvdXNlOmEzMThmMGZlLTcwMmYtNDNjYy1hYmFjLWZmZmMzN2Y3ZTliYw==",
    name: "C our wares",
    clickAndCollectOption: WarehouseClickAndCollectOptionEnum.DISABLED,
    address: listAddress,
    shippingZones: {
      __typename: "ShippingZoneCountableConnection",
      totalCount: shippingZones.length,
      edges: shippingZones.map(node => ({
        __typename: "ShippingZoneCountableEdge" as const,
        node: {
          ...node,
          channels: [],
        },
      })),
    },
  },
  {
    __typename: "Warehouse",
    id: "V2FyZWhvdXNlOjJmN2UyOTlmLWEwMzMtNDhjZS1iYmM5LTFkZDM4NjU2ZjMwYw==",
    name: "Be stocked",
    clickAndCollectOption: WarehouseClickAndCollectOptionEnum.LOCAL,
    address: listAddress,
    shippingZones: {
      __typename: "ShippingZoneCountableConnection",
      totalCount: shippingZones.length,
      edges: shippingZones.map(node => ({
        __typename: "ShippingZoneCountableEdge" as const,
        node: {
          ...node,
          channels: [],
        },
      })),
    },
  },
  {
    __typename: "Warehouse",
    id: "V2FyZWhvdXNlOmM0ZmQ3Nzc0LWZlMjYtNDE1YS1hYjk1LWFlYTFjMjI0NTgwNg==",
    name: "A Warehouse",
    clickAndCollectOption: WarehouseClickAndCollectOptionEnum.ALL,
    address: listAddress,
    shippingZones: {
      __typename: "ShippingZoneCountableConnection",
      totalCount: shippingZones.length,
      edges: shippingZones.map(node => ({
        __typename: "ShippingZoneCountableEdge" as const,
        node: {
          ...node,
          channels: [],
        },
      })),
    },
  },
  {
    __typename: "Warehouse",
    id: "V2FyZWhvdXNlOmNlMmNiZDhhLWRkYmQtNDhiNS1hM2UxLTNmZGVkZGI5MWZkMg==",
    name: "Darkwares",
    clickAndCollectOption: WarehouseClickAndCollectOptionEnum.DISABLED,
    address: listAddress,
    shippingZones: {
      __typename: "ShippingZoneCountableConnection",
      totalCount: shippingZones.length,
      edges: shippingZones.map(node => ({
        __typename: "ShippingZoneCountableEdge" as const,
        node: {
          ...node,
          channels: [],
        },
      })),
    },
  },
];

const email = "test@saleor.io";

const detailsShippingZones: WarehouseDetailsFragment["shippingZones"] = {
  __typename: "ShippingZoneCountableConnection",
  totalCount: shippingZones.length,
  edges: shippingZones.map(node => ({
    __typename: "ShippingZoneCountableEdge" as const,
    node: { __typename: "ShippingZone" as const, id: node.id, name: node.name, channels: [] },
  })),
};

export const warehouse: WarehouseDetailsFragment = {
  ...warehouseList[0],
  isPrivate: true,
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum.DISABLED,
  address,
  shippingZones: detailsShippingZones,
  email,
  metadata: [],
  privateMetadata: [],
};

export const warehouseForPickup: WarehouseDetailsFragment = {
  ...warehouseList[0],
  isPrivate: false,
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum.ALL,
  address,
  shippingZones: detailsShippingZones,
  email,
  metadata: [],
  privateMetadata: [],
};
