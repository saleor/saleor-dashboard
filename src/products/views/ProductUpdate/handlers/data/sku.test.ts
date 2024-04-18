import { DatagridChange } from "@dashboard/components/Datagrid/hooks/useDatagridChange";

import { getSkuData } from "./sku";

describe("getSkuData", () => {
  test("should return name data", () => {
    // Arrange
    const changeData: DatagridChange[] = [
      { column: "sku", row: 1, data: "123" },
      { column: "attribute:2", row: 1, data: { value: { value: "test2" } } },
    ];
    // Act
    const name = getSkuData(changeData, 1);

    // Assert
    expect(name).toEqual("123");
  });
  test("should return undefined when no changes for given row", () => {
    // Arrange
    const changeData: DatagridChange[] = [
      { column: "attribute:2", row: 1, data: { value: { value: "test2" } } },
    ];
    // Act
    const name = getSkuData(changeData, 1);

    // Assert
    expect(name).toEqual(undefined);
  });
  test("should return undefined when no name column for given row", () => {
    // Arrange
    const changeData: DatagridChange[] = [{ column: "sku", row: 2, data: "Joe" }];
    // Act
    const name = getSkuData(changeData, 1);

    // Assert
    expect(name).toEqual(undefined);
  });
});
