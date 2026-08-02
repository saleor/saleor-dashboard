import { getCatalogWarehouseReadiness } from "./catalogWarehouseReadiness";

describe("getCatalogWarehouseReadiness", () => {
  it("returns no_shop_warehouses when the shop has none", () => {
    // Arrange & Act & Assert
    expect(getCatalogWarehouseReadiness({ channelWarehouseCount: 0, shopWarehouseCount: 0 })).toBe(
      "no_shop_warehouses",
    );
  });

  it("returns no_channel_warehouses when the shop has warehouses but the channel does not", () => {
    // Arrange & Act & Assert
    expect(getCatalogWarehouseReadiness({ channelWarehouseCount: 0, shopWarehouseCount: 2 })).toBe(
      "no_channel_warehouses",
    );
  });

  it("returns ready when the channel has warehouses assigned", () => {
    // Arrange & Act & Assert
    expect(getCatalogWarehouseReadiness({ channelWarehouseCount: 1, shopWarehouseCount: 2 })).toBe(
      "ready",
    );
  });
});
