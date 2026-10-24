import { type ApolloClient } from "@apollo/client";
import {
  ChannelZoneWarehouseLinksDocument,
  type ChannelZoneWarehouseLinksQuery,
  type WarehouseSharesChannelsQuery,
} from "@dashboard/graphql";

import { previewChannelEditUnlinks } from "./previewChannelEditUnlinks";

type ZoneEdge = NonNullable<ChannelZoneWarehouseLinksQuery["shippingZones"]>["edges"][number];

const zone = (id: string): ZoneEdge => ({
  __typename: "ShippingZoneCountableEdge",
  node: {
    __typename: "ShippingZone",
    id,
    name: id,
    channels: [
      { __typename: "Channel", id: "ch-eu" },
      { __typename: "Channel", id: "ch-de" },
    ],
    warehouses: [{ __typename: "Warehouse", id: "w-berlin", name: "Berlin" }],
  },
});

const zones: ChannelZoneWarehouseLinksQuery = {
  __typename: "Query",
  shippingZones: {
    __typename: "ShippingZoneCountableConnection",
    pageInfo: { __typename: "PageInfo", hasNextPage: false, endCursor: null },
    edges: [zone("z-1"), zone("z-2"), zone("z-3")],
  },
};

const sharesChannel: WarehouseSharesChannelsQuery = {
  __typename: "Query",
  warehouses: { __typename: "WarehouseCountableConnection", totalCount: 1 },
};

describe("previewChannelEditUnlinks", () => {
  it("probes each warehouse and channel set once, even across many zones", async () => {
    // Arrange
    const query = jest.fn(({ query: document }) =>
      Promise.resolve({
        data: document === ChannelZoneWarehouseLinksDocument ? zones : sharesChannel,
      }),
    );
    // Apollo's generic `query` cannot be typed by a mock; the preview only calls `query`.
    const client = { query } as unknown as ApolloClient<unknown>;

    // Act
    const unlinks = await previewChannelEditUnlinks({
      client,
      channelId: "ch-eu",
      channelWarehouseIds: ["w-berlin"],
      removeWarehouseIds: ["w-berlin"],
      removeZoneIds: [],
    });

    // Assert
    expect(query).toHaveBeenCalledTimes(2);
    expect(unlinks).toEqual([]);
  });
});
