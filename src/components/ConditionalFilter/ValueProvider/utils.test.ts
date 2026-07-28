import { Condition } from "../FilterElement/Condition";
import { ConditionOptions } from "../FilterElement/ConditionOptions";
import { ConditionSelected } from "../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../FilterElement/FilterElement";
import { areFilterContainersEqual } from "./utils";

describe("ConditionalFilter / ValueProvider / utils", () => {
  const categoryFilter = new FilterElement(
    new ExpressionValue("category", "Category", "category"),
    new Condition(
      ConditionOptions.fromStaticElementName("category"),
      new ConditionSelected(
        { label: "is", slug: "is", value: "input-1" },
        { type: "category", value: "accessories", label: "Accessories" },
        [],
        false,
      ),
      false,
    ),
    false,
  );

  it("should treat identical filter containers as equal", () => {
    // Arrange
    const left = [categoryFilter];
    const right = [categoryFilter];

    // Act
    const result = areFilterContainersEqual(left, right);

    // Assert
    expect(result).toBe(true);
  });

  it("should treat empty filter containers as equal", () => {
    // Act
    const result = areFilterContainersEqual([], []);

    // Assert
    expect(result).toBe(true);
  });

  it("should detect when filter containers differ", () => {
    // Arrange
    const left = [categoryFilter];
    const right: typeof left = [];

    // Act
    const result = areFilterContainersEqual(left, right);

    // Assert
    expect(result).toBe(false);
  });
});
