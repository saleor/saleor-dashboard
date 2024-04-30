import { DatagridChange } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { variantAttributes } from "@dashboard/products/fixtures";

import { getAttributeData } from "./attributes";

describe("getAttributeData", () => {
  test("should filter and map data to attribute format", () => {
    // Arrage
    const changeData: DatagridChange[] = [
      {
        column: "attribute:QXR0cmlidXRlOjE1",
        row: 1,
        data: { value: { value: "test" } },
      },
      {
        column: "attribute:QXR0cmlidXRlOjY4MQ==",
        row: 1,
        data: { value: { value: "test2" } },
      },
    ];
    // Act
    const attributes = getAttributeData(changeData, 1, variantAttributes);

    // Assert
    expect(attributes).toEqual([
      {
        id: "QXR0cmlidXRlOjE1",
        dropdown: {
          value: "test",
        },
      },
      { id: "QXR0cmlidXRlOjY4MQ==", plainText: "test2" },
    ]);
  });
  test("should return empty array when no changes for given row", () => {
    // Arrage
    const changeData: DatagridChange[] = [
      { column: "attribute:1", row: 1, data: { value: { value: "test" } } },
      { column: "attribute:2", row: 1, data: { value: { value: "test2" } } },
    ];
    // Act
    const attributes = getAttributeData(changeData, 2, variantAttributes);

    // Assert
    expect(attributes).toEqual([]);
  });
  test("should return empty array when no changes for attributes column", () => {
    // Arrage
    const changeData: DatagridChange[] = [
      { column: "channel:1", row: 1, data: { value: { value: "test" } } },
      { column: "channel:2", row: 1, data: { value: { value: "test2" } } },
    ];
    // Act
    const attributes = getAttributeData(changeData, 1, variantAttributes);

    // Assert
    expect(attributes).toEqual([]);
  });
});
