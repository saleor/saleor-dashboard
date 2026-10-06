import { zonesAvailableToAssign } from "./useWarehouseShippingZoneAssignment";

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
