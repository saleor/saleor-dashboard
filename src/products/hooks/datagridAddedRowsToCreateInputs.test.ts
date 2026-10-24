import { numberCellEmptyValue } from "@dashboard/components/Datagrid/customCells/NumberCell";
import { type DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { variantAttributes } from "@dashboard/products/fixtures";

import {
  datagridAddedRowsToCreateInputs,
  isMeaningfulVariantCreateInput,
} from "./datagridAddedRowsToCreateInputs";

describe("isMeaningfulVariantCreateInput", () => {
  it("rejects an empty draft", () => {
    // Arrange
    const input = { attributes: [] };

    // Act & Assert
    expect(isMeaningfulVariantCreateInput(input)).toBe(false);
  });

  it("rejects whitespace-only name or sku", () => {
    // Arrange & Act & Assert
    expect(isMeaningfulVariantCreateInput({ attributes: [], name: "   " })).toBe(false);
    expect(isMeaningfulVariantCreateInput({ attributes: [], sku: "\t" })).toBe(false);
  });

  it("accepts a name, sku, price, or stock — including zero", () => {
    // Arrange & Act & Assert
    expect(isMeaningfulVariantCreateInput({ attributes: [], name: "Large" })).toBe(true);
    expect(isMeaningfulVariantCreateInput({ attributes: [], sku: "LG-1" })).toBe(true);
    expect(
      isMeaningfulVariantCreateInput({
        attributes: [],
        channelListings: [{ channelId: "ch-1", price: "0" }],
      }),
    ).toBe(true);
    expect(
      isMeaningfulVariantCreateInput({
        attributes: [],
        stocks: [{ warehouse: "wh-1", quantity: 0 }],
      }),
    ).toBe(true);
  });

  it("rejects empty channel listings left after clearing a price", () => {
    // Arrange & Act & Assert
    expect(isMeaningfulVariantCreateInput({ attributes: [], channelListings: [] })).toBe(false);
  });
});

describe("datagridAddedRowsToCreateInputs", () => {
  it("drops empty added rows so an untouched ghost is not a create", () => {
    // Arrange
    const data: DatagridChangeOpts = {
      added: [2, 3],
      removed: [],
      updates: [],
    };

    // Act
    const creates = datagridAddedRowsToCreateInputs(data);

    // Assert
    expect(creates).toEqual([]);
  });

  it("maps name, sku, attributes, price, and stock from the added row", () => {
    // Arrange
    const data: DatagridChangeOpts = {
      added: [5],
      removed: [],
      updates: [
        { column: "name", row: 5, data: "Large" },
        { column: "sku", row: 5, data: "  LG-1  " },
        {
          column: `attribute:${variantAttributes[0].id}`,
          row: 5,
          data: { value: { value: "1l" } },
        },
        { column: "channel:ch-1", row: 5, data: { value: 12.5 } },
        { column: "warehouse:wh-1", row: 5, data: { value: 4 } },
      ],
    };

    // Act
    const creates = datagridAddedRowsToCreateInputs(data, variantAttributes);

    // Assert
    expect(creates).toEqual([
      {
        attributes: [{ id: variantAttributes[0].id, dropdown: { value: "1l" } }],
        name: "Large",
        sku: "LG-1",
        channelListings: [{ channelId: "ch-1", price: "12.5" }],
        stocks: [{ warehouse: "wh-1", quantity: 4 }],
      },
    ]);
  });

  it("ignores updates that belong to existing (non-added) rows", () => {
    // Arrange
    const data: DatagridChangeOpts = {
      added: [1],
      removed: [],
      updates: [
        { column: "name", row: 0, data: "Existing" },
        { column: "name", row: 1, data: "New" },
      ],
    };

    // Act
    const creates = datagridAddedRowsToCreateInputs(data);

    // Assert
    expect(creates).toEqual([{ attributes: [], name: "New" }]);
  });

  it("omits empty price cells", () => {
    // Arrange
    const data: DatagridChangeOpts = {
      added: [0],
      removed: [],
      updates: [{ column: "channel:ch-1", row: 0, data: { value: numberCellEmptyValue } }],
    };

    // Act
    const creates = datagridAddedRowsToCreateInputs(data);

    // Assert
    expect(creates).toEqual([]);
  });
});
