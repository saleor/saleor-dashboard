import { ConditionOptions } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionSelected";
import { ExpressionValue } from "@dashboard/components/ConditionalFilter/FilterElement/FilterElement";

import { Condition, FilterContainer, FilterElement } from "../FilterElement";
import { getFilterElement } from "./utils";

describe("ConditionalFilter / API / utils / getFilterElement", () => {
  it("should return filter element at index", () => {
    // Arrange
    const firstFilterElement: FilterElement = new FilterElement(
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
    );
    const filterContainer: FilterContainer = [firstFilterElement];

    // Act
    const result = getFilterElement(filterContainer, 0);

    // Assert
    expect(result).toEqual(firstFilterElement);
  });

  it("throws error when unknown filter element is used", () => {
    // Arrange
    const filterContainer: FilterContainer = [];

    // Act & Assert
    expect(() => getFilterElement(filterContainer, 2)).toThrowError(
      "Unknown filter element used to create API handler",
    );
  });
});
