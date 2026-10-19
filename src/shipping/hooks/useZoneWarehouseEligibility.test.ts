import { ApolloClient, ApolloLink, InMemoryCache, Observable } from "@apollo/client";
import { type WarehousesInChannelsQuery } from "@dashboard/graphql";
import { type WarehouseChoice } from "@dashboard/shipping/warehouseEligibility";

import { warehousesUnlinkedByRemovingZoneChannels } from "./useZoneWarehouseEligibility";

interface WarehousesInChannelsRequest {
  ids: string[];
  first: number;
}

const warehousesResponse = (ids: string[]): WarehousesInChannelsQuery => ({
  __typename: "Query",
  warehouses: {
    __typename: "WarehouseCountableConnection",
    edges: ids.map(id => ({
      __typename: "WarehouseCountableEdge",
      node: { __typename: "Warehouse", id },
    })),
  },
});

/** Answers each request with the requested warehouses that still share a channel. */
const createClient = ({
  sharingIds,
  requests,
}: {
  sharingIds: ReadonlySet<string>;
  requests: WarehousesInChannelsRequest[];
}): ApolloClient<object> =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new ApolloLink(operation => {
      const ids: string[] = operation.variables.ids;
      const first: number = operation.variables.first;

      requests.push({ ids, first });

      return Observable.of({
        data: warehousesResponse(ids.filter(id => sharingIds.has(id))),
      });
    }),
  });

describe("warehousesUnlinkedByRemovingZoneChannels", () => {
  it("checks more than 100 linked warehouses in requests Saleor accepts", async () => {
    // Arrange
    const linked: WarehouseChoice[] = Array.from({ length: 150 }, (_, index) => ({
      id: `warehouse-${index}`,
      name: `Warehouse ${index}`,
    }));
    const requests: WarehousesInChannelsRequest[] = [];
    const client = createClient({
      sharingIds: new Set(["warehouse-0", "warehouse-120"]),
      requests,
    });

    // Act
    const unlinked = await warehousesUnlinkedByRemovingZoneChannels({
      client,
      linked,
      remainingChannelIds: ["channel-1"],
    });

    // Assert
    expect(requests.map(request => request.first)).toEqual([100, 50]);
    expect(requests.map(request => request.ids.length)).toEqual([100, 50]);
    expect(unlinked).toHaveLength(148);
    expect(unlinked.map(warehouse => warehouse.id)).not.toContain("warehouse-0");
    expect(unlinked.map(warehouse => warehouse.id)).not.toContain("warehouse-120");
  });

  it("unlinks every warehouse without a request when no channel remains", async () => {
    // Arrange
    const linked: WarehouseChoice[] = [{ id: "warehouse-1", name: "Warehouse 1" }];
    const requests: WarehousesInChannelsRequest[] = [];
    const client = createClient({ sharingIds: new Set(), requests });

    // Act
    const unlinked = await warehousesUnlinkedByRemovingZoneChannels({
      client,
      linked,
      remainingChannelIds: [],
    });

    // Assert
    expect(requests).toHaveLength(0);
    expect(unlinked).toEqual(linked);
  });
});
