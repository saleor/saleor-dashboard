import {
  shippingZonesAssignPageSize,
  uniqueById,
  zonesAvailableToAssign,
} from "./useWarehouseShippingZoneAssignment";

interface ZoneRow {
  id: string;
  name: string;
}

interface ZoneEdge {
  cursor: string;
  node: ZoneRow;
}

describe("shippingZonesAssignPageSize", () => {
  it("scales with channel count so dedupe still fills a page", () => {
    // Arrange
    const channelCounts: number[] = [1, 4, 7, 0];

    // Act
    const pageSizes = channelCounts.map(shippingZonesAssignPageSize);

    // Assert
    expect(pageSizes).toEqual([20, 80, 100, 20]);
  });
});

describe("uniqueById", () => {
  it("keeps the first row when Saleor returns one zone per channel", () => {
    // Arrange — same id repeated once per warehouse channel (API quirk).
    const zones: ZoneRow[] = [
      { id: "zone-eu", name: "Europe" },
      { id: "zone-eu", name: "Europe" },
      { id: "zone-eu", name: "Europe" },
      { id: "zone-oc", name: "Oceania" },
      { id: "zone-oc", name: "Oceania" },
    ];

    // Act
    const unique = uniqueById(zones, zone => zone.id);

    // Assert
    expect(unique).toEqual([
      { id: "zone-eu", name: "Europe" },
      { id: "zone-oc", name: "Oceania" },
    ]);
  });

  it("dedupes connection edges by node id", () => {
    // Arrange
    const edges: ZoneEdge[] = [
      { cursor: "a", node: { id: "zone-eu", name: "Europe" } },
      { cursor: "b", node: { id: "zone-eu", name: "Europe" } },
      { cursor: "c", node: { id: "zone-oc", name: "Oceania" } },
    ];

    // Act
    const unique = uniqueById(edges, edge => edge.node.id);

    // Assert
    expect(unique).toEqual([
      { cursor: "a", node: { id: "zone-eu", name: "Europe" } },
      { cursor: "c", node: { id: "zone-oc", name: "Oceania" } },
    ]);
  });
});

describe("zonesAvailableToAssign", () => {
  it("drops zones this location is already in", () => {
    // Arrange
    const zones: ZoneRow[] = [
      { id: "zone-1", name: "Brazil" },
      { id: "zone-2", name: "Europe" },
    ];

    // Act
    const available = zonesAvailableToAssign(zones, ["zone-1"]);

    // Assert
    expect(available).toEqual([{ id: "zone-2", name: "Europe" }]);
  });
});
