// @ts-strict-ignore
import { isCurrentRow } from "./datagrid";

describe("isCurrentRow", () => {
  test("should return true when variant index is equal to datagrid row index and no removed rows", () => {
    // Arrange & Act
    const datagridChangeRowIndex = 1;
    const variantIndex = 1;
    const datagridRemoveRowsIds = [];

    // Assert
    expect(
      isCurrentRow(datagridChangeRowIndex, variantIndex, datagridRemoveRowsIds),
    ).toEqual(true);
  });

  test("should return true when variant index is equal to datagrid row index and removed rows contain higher rows ids", () => {
    // Arrange & Act
    const datagridChangeRowIndex = 1;
    const variantIndex = 1;
    const datagridRemoveRowsIds = [4, 5, 6];

    // Assert
    expect(
      isCurrentRow(datagridChangeRowIndex, variantIndex, datagridRemoveRowsIds),
    ).toEqual(true);
  });

  test("should return false when variant index is not equal to datagrid row index and removed rows contains prev row id", () => {
    // Arrange & Act
    const datagridChangeRowIndex = 2;
    const variantIndex = 1;
    const datagridRemoveRowsIds = [1];

    // Assert
    expect(
      isCurrentRow(datagridChangeRowIndex, variantIndex, datagridRemoveRowsIds),
    ).toEqual(true);
  });

  test("should return false when variant index is not equal to datagrid row index ", () => {
    // Arrange & Act
    const datagridChangeRowIndex = 1;
    const variantIndex = 2;
    const datagridRemoveRowsIds = [];

    // Assert
    expect(
      isCurrentRow(datagridChangeRowIndex, variantIndex, datagridRemoveRowsIds),
    ).toEqual(false);
  });

  test("should return false when variant index is equal to datagrid row index and removed rows contains prev row id", () => {
    // Arrange & Act
    const datagridChangeRowIndex = 2;
    const variantIndex = 2;
    const datagridRemoveRowsIds = [1];

    // Assert
    expect(
      isCurrentRow(datagridChangeRowIndex, variantIndex, datagridRemoveRowsIds),
    ).toEqual(false);
  });
});
