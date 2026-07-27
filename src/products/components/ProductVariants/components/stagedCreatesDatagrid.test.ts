import { numberCellEmptyValue } from "@dashboard/components/Datagrid/customCells/NumberCell";
import { type ProductVariantBulkCreateInput } from "@dashboard/graphql";

import { applyStagedCreatesDatagridOpts, applyStagedCreateUpdate } from "./stagedCreatesDatagrid";

describe("stagedCreatesDatagrid", () => {
  const baseCreate: ProductVariantBulkCreateInput = {
    name: "Red / S",
    sku: "RED-S",
    attributes: [{ id: "color", values: ["red"] }],
  };

  it("updates name and sku from datagrid changes", () => {
    // Arrange / Act
    const withName = applyStagedCreateUpdate(baseCreate, {
      column: "name",
      row: 0,
      data: "Crimson / S",
    });
    const withSku = applyStagedCreateUpdate(withName, {
      column: "sku",
      row: 0,
      data: "CRIMSON-S",
    });

    // Assert
    expect(withSku.name).toBe("Crimson / S");
    expect(withSku.sku).toBe("CRIMSON-S");
  });

  it("sets and clears channel prices on staged creates", () => {
    // Arrange / Act
    const withPrice = applyStagedCreateUpdate(baseCreate, {
      column: "channel:ch1",
      row: 0,
      data: { value: 12.5 },
    });
    const cleared = applyStagedCreateUpdate(withPrice, {
      column: "channel:ch1",
      row: 0,
      data: { value: numberCellEmptyValue },
    });

    // Assert
    expect(withPrice.channelListings).toEqual([{ channelId: "ch1", price: "12.5" }]);
    expect(cleared.channelListings).toEqual([]);
  });

  it("sets warehouse stock quantities on staged creates", () => {
    // Arrange / Act
    const withStock = applyStagedCreateUpdate(baseCreate, {
      column: "warehouse:wh1",
      row: 0,
      data: { value: 8 },
    });

    // Assert
    expect(withStock.stocks).toEqual([{ warehouse: "wh1", quantity: 8 }]);
  });

  it("ignores non-finite price and stock values", () => {
    // Arrange / Act
    const withBadPrice = applyStagedCreateUpdate(baseCreate, {
      column: "channel:ch1",
      row: 0,
      data: { value: Number.NaN },
    });
    const withBadStock = applyStagedCreateUpdate(baseCreate, {
      column: "warehouse:wh1",
      row: 0,
      data: { value: Number.NaN },
    });

    // Assert
    expect(withBadPrice.channelListings).toBeUndefined();
    expect(withBadStock.stocks).toBeUndefined();
  });

  it("applies updates and removals from datagrid opts", () => {
    // Arrange
    const creates: ProductVariantBulkCreateInput[] = [
      { ...baseCreate, name: "A" },
      { ...baseCreate, name: "B", sku: "B" },
      { ...baseCreate, name: "C", sku: "C" },
    ];

    // Act
    const next = applyStagedCreatesDatagridOpts(creates, {
      added: [],
      removed: [1],
      updates: [{ column: "sku", row: 0, data: "A-1" }],
    });

    // Assert
    expect(next).toEqual([
      expect.objectContaining({ name: "A", sku: "A-1" }),
      expect.objectContaining({ name: "C", sku: "C" }),
    ]);
  });
});
