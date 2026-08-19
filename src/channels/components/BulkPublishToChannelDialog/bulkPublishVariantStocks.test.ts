import { buildBulkPublishVariantStocksInput } from "./bulkPublishVariantStocks";

describe("buildBulkPublishVariantStocksInput", () => {
  it("creates stock for warehouses without an existing row and updates the rest", () => {
    // Arrange
    const variant = {
      stocks: [
        { id: "s1", warehouse: { id: "w1" } },
        { id: "s2", warehouse: { id: "w2" } },
      ],
    };

    // Act
    const input = buildBulkPublishVariantStocksInput({
      variant,
      warehouseIds: ["w1", "w2", "w3"],
      quantity: 12,
    });

    // Assert
    expect(input).toEqual({
      create: [{ warehouse: "w3", quantity: 12 }],
      update: [
        { stock: "s1", quantity: 12 },
        { stock: "s2", quantity: 12 },
      ],
    });
  });

  it("creates all stocks when the variant has none", () => {
    // Arrange
    const variant = { stocks: [] };

    // Act
    const input = buildBulkPublishVariantStocksInput({
      variant,
      warehouseIds: ["w1", "w2"],
      quantity: 4,
    });

    // Assert
    expect(input).toEqual({
      create: [
        { warehouse: "w1", quantity: 4 },
        { warehouse: "w2", quantity: 4 },
      ],
    });
  });

  it("omits create when every target warehouse already has stock", () => {
    // Arrange
    const variant = {
      stocks: [{ id: "s1", warehouse: { id: "w1" } }],
    };

    // Act
    const input = buildBulkPublishVariantStocksInput({
      variant,
      warehouseIds: ["w1"],
      quantity: 9,
    });

    // Assert
    expect(input).toEqual({
      update: [{ stock: "s1", quantity: 9 }],
    });
  });

  it("returns undefined when there are no warehouses or quantity is unusable", () => {
    // Arrange
    const variant = { stocks: [{ id: "s1", warehouse: { id: "w1" } }] };

    // Act & Assert
    expect(
      buildBulkPublishVariantStocksInput({
        variant,
        warehouseIds: [],
        quantity: 5,
      }),
    ).toBeUndefined();
    expect(
      buildBulkPublishVariantStocksInput({
        variant,
        warehouseIds: ["w1"],
        quantity: Number.NaN,
      }),
    ).toBeUndefined();
  });
});
