import { Condition, FilterContainer, FilterElement } from "./FilterElement";
import { ConditionOptions } from "./FilterElement/ConditionOptions";
import { ConditionSelected } from "./FilterElement/ConditionSelected";
import { ExpressionValue } from "./FilterElement/FilterElement";
import { createProductQueryVariables } from "./queryVariables";

const createConditionValue = (
  label: string,
  slug: string,
  value: string,
  originalSlug?: string,
) => ({
  label,
  slug,
  value,
  originalSlug,
});
const createConditionItem = (type: string, value: string, label: string) => ({
  type,
  value,
  label,
});

const createConditionOptions = (
  label: string,
  slug: string,
  value: string,
  originalSlug: string,
) => [
  {
    label,
    slug,
    value,
    originalSlug,
  },
];

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
      new FilterElement(
        new ExpressionValue("price", "Price", "price"),
        new Condition(
          ConditionOptions.fromStaticElementName("price"),
          new ConditionSelected(
            createConditionValue("price", "price", "123"),
            createConditionItem("price", "123", "Price"),
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
            createConditionValue(
              "bottle-size",
              "bottle-id",
              "bottle-id",
              "0-5l",
            ),
            createConditionItem("DROPDOWN", "bottle-id", "Bottle size"),
            createConditionOptions(
              "bottle-size",
              "bottle-id",
              "bottle-id",
              "0-5l",
            ),
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
