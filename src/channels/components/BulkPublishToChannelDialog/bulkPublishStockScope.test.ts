import { canSetBulkPublishStock, getBulkPublishStockScope } from "./bulkPublishStockScope";

describe("getBulkPublishStockScope", () => {
  const channelWarehouses = [
    { id: "w1", name: "US East" },
    { id: "w2", name: "US West" },
  ];

  it("returns no_shop_warehouses when the shop has none", () => {
    // Arrange & Act
    const scope = getBulkPublishStockScope({
      channelWarehouses: [],
      shopWarehouseCount: 0,
    });

    // Assert
    expect(scope).toEqual({ kind: "no_shop_warehouses" });
    expect(canSetBulkPublishStock(scope)).toBe(false);
  });

  it("returns channel_warehouses when the channel has assignments", () => {
    // Arrange & Act
    const scope = getBulkPublishStockScope({
      channelWarehouses,
      shopWarehouseCount: 4,
    });

    // Assert
    expect(scope).toEqual({ kind: "channel_warehouses", warehouses: channelWarehouses });
    expect(canSetBulkPublishStock(scope)).toBe(true);
  });

  it("returns no_channel_warehouses when the shop has warehouses but the channel does not", () => {
    // Arrange & Act
    const scope = getBulkPublishStockScope({
      channelWarehouses: [],
      shopWarehouseCount: 4,
    });

    // Assert
    expect(scope).toEqual({ kind: "no_channel_warehouses" });
    expect(canSetBulkPublishStock(scope)).toBe(false);
  });
});
