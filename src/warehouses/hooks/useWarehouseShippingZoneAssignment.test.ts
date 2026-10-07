import {
  shippingZonesAssignPageSize,
  uniqueById,
  zonesAvailableToAssign,
} from "./useWarehouseShippingZoneAssignment";

describe("shippingZonesAssignPageSize", () => {
  it("scales with channel count so dedupe still fills a page", () => {
    // Assert
    expect(shippingZonesAssignPageSize(1)).toBe(20);
    expect(shippingZonesAssignPageSize(4)).toBe(80);
    expect(shippingZonesAssignPageSize(7)).toBe(100);
    expect(shippingZonesAssignPageSize(0)).toBe(20);
  });
});

describe("uniqueById", () => {
  it("keeps the first row when Saleor returns one zone per channel", () => {
    // Arrange — same id repeated once per warehouse channel (API quirk).
    const zones = [
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
    const edges = [
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
    const zones = [
      { id: "zone-1", name: "Brazil" },
      { id: "zone-2", name: "Europe" },
    ];

    // Act
    const available = zonesAvailableToAssign(zones, ["zone-1"]);

    // Assert
    expect(available).toEqual([{ id: "zone-2", name: "Europe" }]);
  });
});
