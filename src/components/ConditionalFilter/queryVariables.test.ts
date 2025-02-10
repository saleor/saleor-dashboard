import { Condition, FilterContainer, FilterElement } from "./FilterElement";
import { ConditionOptions } from "./FilterElement/ConditionOptions";
import { ConditionSelected } from "./FilterElement/ConditionSelected";
import { ExpressionValue } from "./FilterElement/FilterElement";
import {
  creatDraftOrderQueryVariables,
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

describe("ConditionalFilter / queryVariables / creatDraftOrderQueryVariables", () => {
  it("should return empty variables for empty filters", () => {
    // Arrange
    const filters: FilterContainer = [];
    const expectedOutput = {};
    // Act
    const result = creatDraftOrderQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should create variables with selected filters", () => {
    // Arrange
    const filters: FilterContainer = [
      new FilterElement(
        new ExpressionValue("customer", "Customer", "customer"),
        new Condition(
          ConditionOptions.fromStaticElementName("customer"),
          new ConditionSelected(
            { label: "customer1", slug: "customer1", value: "value1" },
            { type: "text", label: "is", value: "input-1" },
            [],
            false,
          ),
          false,
        ),
        false,
      ),
      "AND",
      new FilterElement(
        new ExpressionValue("created", "Created", "created"),
        new Condition(
          ConditionOptions.fromStaticElementName("customer"),
          new ConditionSelected(
            ["2025-02-01", "2025-02-05"],
            { type: "date.range", label: "between", value: "input-3" },
            [],
            false,
          ),
          false,
        ),
        false,
      ),
    ];
    const expectedOutput = {
      created: { gte: "2025-02-01", lte: "2025-02-05" },
      customer: "value1",
    };
    // Act
    const result = creatDraftOrderQueryVariables(filters);

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
