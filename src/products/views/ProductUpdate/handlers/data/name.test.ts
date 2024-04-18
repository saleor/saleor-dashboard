import { DatagridChange } from "@dashboard/components/Datagrid/hooks/useDatagridChange";

import { getNameData } from "./name";

describe("getNameData", () => {
  test("should return name data", () => {
    // Arrange
    const changeData: DatagridChange[] = [
      { column: "name", row: 1, data: "Joe" },
      { column: "attribute:2", row: 1, data: { value: { value: "test2" } } },
    ];
    // Act
    const name = getNameData(changeData, 1);

    // Assert
    expect(name).toEqual("Joe");
  });
  test("should return undefined when no changes for given row", () => {
    // Arrange
    const changeData: DatagridChange[] = [
      { column: "attribute:2", row: 1, data: { value: { value: "test2" } } },
    ];
    // Act
    const name = getNameData(changeData, 1);

    // Assert
    expect(name).toEqual(undefined);
  });
  test("should return undefined when no name column for given row", () => {
    // Arrange
    const changeData: DatagridChange[] = [{ column: "name", row: 2, data: "Joe" }];
    // Act
    const name = getNameData(changeData, 1);

    // Assert
    expect(name).toEqual(undefined);
  });
});
