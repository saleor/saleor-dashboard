import {
  BULK_PUBLISH_STOCK_ALL_WAREHOUSES,
  getBulkPublishStockWarehouses,
  getBulkPublishStockWarehouseSelectValue,
  isValidBulkPublishStockWarehouseSelection,
} from "./bulkPublishStockWarehouses";
import { type BulkPublishStockSettings } from "./types";

describe("bulkPublishStockWarehouses", () => {
  const channelWarehouses = [
    { id: "w1", name: "US East" },
    { id: "w2", name: "US West" },
  ];

  const enabledStock: BulkPublishStockSettings = {
    enabled: true,
    defaultQuantity: "10",
    warehouseScope: "all_channel",
    warehouseId: "",
  };

  it("returns all channel warehouses when scope is all_channel", () => {
    // Arrange & Act
    const warehouses = getBulkPublishStockWarehouses({
      channelWarehouses,
      stock: enabledStock,
    });

    // Assert
    expect(warehouses).toEqual(channelWarehouses);
  });

  it("returns a single warehouse when scope is single", () => {
    // Arrange & Act
    const warehouses = getBulkPublishStockWarehouses({
      channelWarehouses,
      stock: {
        ...enabledStock,
        warehouseScope: "single",
        warehouseId: "w2",
      },
    });

    // Assert
    expect(warehouses).toEqual([{ id: "w2", name: "US West" }]);
  });

  it("returns no warehouses for an invalid single selection", () => {
    // Arrange & Act
    const warehouses = getBulkPublishStockWarehouses({
      channelWarehouses,
      stock: {
        ...enabledStock,
        warehouseScope: "single",
        warehouseId: "missing",
      },
    });

    // Assert
    expect(warehouses).toEqual([]);
  });

  it("maps select value to all warehouses token", () => {
    // Arrange & Act & Assert
    expect(getBulkPublishStockWarehouseSelectValue(enabledStock)).toBe(
      BULK_PUBLISH_STOCK_ALL_WAREHOUSES,
    );
    expect(
      getBulkPublishStockWarehouseSelectValue({
        ...enabledStock,
        warehouseScope: "single",
        warehouseId: "w1",
      }),
    ).toBe("w1");
  });

  it("validates single warehouse selection when multiple warehouses exist", () => {
    // Arrange & Act & Assert
    expect(
      isValidBulkPublishStockWarehouseSelection({
        channelWarehouses,
        stock: enabledStock,
      }),
    ).toBe(true);
    expect(
      isValidBulkPublishStockWarehouseSelection({
        channelWarehouses,
        stock: {
          ...enabledStock,
          warehouseScope: "single",
          warehouseId: "w2",
        },
      }),
    ).toBe(true);
    expect(
      isValidBulkPublishStockWarehouseSelection({
        channelWarehouses,
        stock: {
          ...enabledStock,
          warehouseScope: "single",
          warehouseId: "",
        },
      }),
    ).toBe(false);
  });
});
