import { hasMoreDecimalPlacesThan } from "./decimalPlaces";

describe("hasMoreDecimalPlacesThan", () => {
  it.each<[number, number, boolean]>([
    [10.99, 2, false],
    [1234567.89, 2, false],
    [131072.14, 2, false],
    [10.999, 2, true],
    [0.001, 3, false],
    [12.345, 3, false],
    [0.0001, 3, true],
    [100, 0, false],
    [100.5, 0, true],
  ])("reads %p with %p decimal places as too precise: %p", (amount, places, expected) => {
    // Arrange & Act
    const tooPrecise = hasMoreDecimalPlacesThan(amount, places);

    // Assert
    expect(tooPrecise).toBe(expected);
  });
});
