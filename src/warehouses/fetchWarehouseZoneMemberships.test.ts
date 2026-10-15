import { type ApolloClient } from "@apollo/client";
import { type WarehouseShippingZonesPageQuery } from "@dashboard/graphql";

import { checkChannelRemoval } from "./fetchWarehouseZoneMemberships";

type ZoneConnection = NonNullable<
  NonNullable<WarehouseShippingZonesPageQuery["warehouse"]>["shippingZones"]
>;

const page = (
  zones: Array<{ id: string; channelIds: string[] }>,
  endCursor: string | null,
): WarehouseShippingZonesPageQuery => {
  const shippingZones: ZoneConnection = {
    __typename: "ShippingZoneCountableConnection",
    totalCount: 2,
    edges: zones.map(zone => ({
      __typename: "ShippingZoneCountableEdge",
      node: {
        __typename: "ShippingZone",
        id: zone.id,
        name: zone.id,
        channels: zone.channelIds.map(id => ({ __typename: "Channel", id })),
      },
    })),
    pageInfo: { __typename: "PageInfo", hasNextPage: endCursor !== null, endCursor },
  };

  return {
    __typename: "Query",
    warehouse: { __typename: "Warehouse", id: "w-1", shippingZones },
  };
};

// Apollo's generic `query` cannot be typed by a mock; these helpers only call `query`.
const clientWith = (query: jest.Mock): ApolloClient<unknown> =>
  ({ query }) as unknown as ApolloClient<unknown>;

describe("checkChannelRemoval", () => {
  it("names a zone that unlinks on a later page of the warehouse's zones", async () => {
    // Arrange
    const query = jest
      .fn()
      .mockResolvedValueOnce({ data: page([{ id: "Shared", channelIds: ["eu", "us"] }], "c1") })
      .mockResolvedValueOnce({ data: page([{ id: "Europe", channelIds: ["eu"] }], null) });

    // Act
    const confirmation = await checkChannelRemoval({
      client: clientWith(query),
      warehouseId: "w-1",
      removedChannelId: "eu",
      remainingChannelIds: ["us"],
    });

    // Assert
    expect(query).toHaveBeenCalledTimes(2);
    expect(confirmation).toEqual({ zoneNames: ["Europe"] });
  });

  it("removes at once when no zone depends on the channel alone", async () => {
    // Arrange
    const query = jest
      .fn()
      .mockResolvedValueOnce({ data: page([{ id: "Shared", channelIds: ["eu", "us"] }], null) });

    // Act
    const confirmation = await checkChannelRemoval({
      client: clientWith(query),
      warehouseId: "w-1",
      removedChannelId: "eu",
      remainingChannelIds: ["us"],
    });

    // Assert
    expect(confirmation).toBeNull();
  });

  it("still asks for confirmation when the zones cannot be loaded", async () => {
    // Arrange
    const query = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    // Act
    const confirmation = await checkChannelRemoval({
      client: clientWith(query),
      warehouseId: "w-1",
      removedChannelId: "eu",
      remainingChannelIds: ["us"],
    });

    // Assert
    expect(confirmation).toEqual({ zoneNames: null });
  });
});
