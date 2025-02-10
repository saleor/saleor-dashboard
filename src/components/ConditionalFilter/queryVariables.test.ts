import { Condition, FilterContainer, FilterElement } from "./FilterElement";
import { ConditionOptions } from "./FilterElement/ConditionOptions";
import { ConditionSelected } from "./FilterElement/ConditionSelected";
import { ExpressionValue } from "./FilterElement/FilterElement";
import {
  createPageQueryVariables,
  createProductQueryVariables,
  mapStaticQueryPartToLegacyVariables,
} from "./queryVariables";

describe("ConditionalFilter / queryVariables / createProductQueryVariables", () => {
  it("should return empty variables for empty filters", () => {
    // Arrange
    const filters: FilterContainer = [];
    const expectedOutput = {};
    // Act
    const result = createProductQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
  it("should create variables with selected filters", () => {
    // Arrange
    const filters: FilterContainer = [
      new FilterElement(
        new ExpressionValue("price", "Price", "price"),
        new Condition(
          ConditionOptions.fromStaticElementName("price"),
          new ConditionSelected(
            { label: "price", slug: "price", value: "123" },
            { type: "price", value: "123", label: "Price" },
            [],
            false,
          ),
          false,
        ),
        false,
      ),
      "AND",
      new FilterElement(
        new ExpressionValue("bottle-size", "Bottle size", "DROPDOWN"),
        new Condition(
          ConditionOptions.fromAttributeType("DROPDOWN"),
          new ConditionSelected(
            {
              label: "bottle-size",
              slug: "bottle-id",
              value: "bottle-id",
              originalSlug: "0-5l",
            },
            {
              type: "DROPDOWN",
              value: "bottle-id",
              label: "Bottle size",
            },
            [
              {
                label: "bottle-size",
                slug: "bottle-id",
                value: "bottle-id",
                originalSlug: "0-5l",
              },
            ],
            false,
          ),
          false,
        ),
        false,
      ),
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

describe("ConditionalFilter / queryVariables / createPageQueryVariables", () => {
  it("should return empty variables for empty filters", () => {
    // Arrange
    const filters: FilterContainer = [];
    const expectedOutput = {};
    // Act
    const result = createPageQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
  it("should create variables with selected filters", () => {
    // Arrange
    const filters: FilterContainer = [
      new FilterElement(
        new ExpressionValue("pageTypes", "Product types", "pageTypes"),
        new Condition(
          ConditionOptions.fromStaticElementName("pageTypes"),
          new ConditionSelected(
            [
              { label: "pageTypes1", slug: "pageTypes1", value: "value1" },
              { label: "pageTypes2", slug: "pageTypes2", value: "value2" },
            ],
            { type: "multiselect", label: "in", value: "input-1" },
            [],
            false,
          ),
          false,
        ),
        false,
      ),
    ];
    const expectedOutput = {
      pageTypes: ["value1", "value2"],
    };
    // Act
    const result = createPageQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});

describe("ConditionalFilter / queryVariables / mapStaticQueryPartToLegacyVariables", () => {
  it("should return queryPart if it is not an object", () => {
    // Arrange
    const queryPart = "queryPart";
    const expectedOutput = "queryPart";

    // Act
    const result = mapStaticQueryPartToLegacyVariables(queryPart);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should transform range input to legacy format", () => {
    // Arrange
    const queryPart = { range: { lte: "value" } };
    const expectedOutput = { lte: "value" };

    // Act
    const result = mapStaticQueryPartToLegacyVariables(queryPart);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should transform eq input to legacy format", () => {
    // Arrange
    const queryPart = { eq: "value" };
    const expectedOutput = "value";
    // Act
    const result = mapStaticQueryPartToLegacyVariables(queryPart);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should transform oneOf input to legacy format", () => {
    // Arrange
    const queryPart = { oneOf: ["value1", "value2"] };
    const expectedOutput = ["value1", "value2"];
    // Act
    const result = mapStaticQueryPartToLegacyVariables(queryPart);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
