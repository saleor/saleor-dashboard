// @ts-strict-ignore
import { Locale } from "@dashboard/components/Locale";

import {
  numberCellEmptyValue,
  NumberCellProps,
  numberCellRenderer,
} from "./NumberCell";

const locale = Locale.EN;

// TODO
// check negative values

describe("NumberCell renderer", () => {
  it("should paste integer value", () => {
    // Arrange
    const { onPaste } = numberCellRenderer(locale);
    const value = "10";
    const data = { value: 0 } as NumberCellProps;

    // Act
    const result = onPaste(value, data);

    // Assert
    expect(result.value).toBe(10);
  });

  it("should paste float value", () => {
    // Arrange
    const { onPaste } = numberCellRenderer(locale);
    const value = "10.5";
    const data = { value: 0 } as NumberCellProps;

    // Act
    const result = onPaste(value, data);

    // Assert
    expect(result.value).toBe(10.5);
  });

  it("should return empty cell if value is negative", () => {
    // Arrange
    const { onPaste } = numberCellRenderer(locale);
    const value = "-10";
    const data = { value: 0 } as NumberCellProps;

    // Act
    const result = onPaste(value, data);

    // Assert
    expect(result.value).toBe(numberCellEmptyValue);
  });

  it("should return empty cell if value is not a number", () => {
    // Arrange
    const { onPaste } = numberCellRenderer(locale);
    const value = "UwU";
    const data = { value: 0 } as NumberCellProps;

    // Act
    const result = onPaste(value, data);

    // Assert
    expect(result.value).toBe(numberCellEmptyValue);
  });

  it("should paste integer value under 10", () => {
    // Arrange
    const { onPaste } = numberCellRenderer(locale);
    const value = "5";
    const data = { value: 0 } as NumberCellProps;

    // Act
    const result = onPaste(value, data);

    // Assert
    expect(result.value).toBe(5);
  });
});
