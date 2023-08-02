import { FilterContainer } from "./FilterElement";
import { attributeBottleSizeElement, staticPriceElement } from "./fixtures";
import { createProductQueryVariables } from "./queryVariables";

describe("ConditionalFilter / queryVariables / createProductQueryVariables", () => {
  it("should return empty variables for empty filters", () => {
    // Arrange
    const filters: FilterContainer = [];
    const expectedOutput = {
      attributes: [],
    };
    // Act
    const result = createProductQueryVariables(filters);
    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should create variables with selected filters", () => {
    // Arrange
    const filters: FilterContainer = [
      staticPriceElement,
      "AND",
      attributeBottleSizeElement,
    ];
    const expectedOutput = {
      attributes: [{ slug: "bottle-size", values: ["0-5l"] }],
      price: { eq: "123" },
    };
    // Act
    const result = createProductQueryVariables(filters);
    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
