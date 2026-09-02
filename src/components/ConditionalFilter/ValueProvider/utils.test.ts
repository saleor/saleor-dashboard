import { Condition } from "../FilterElement/Condition";
import { ConditionOptions } from "../FilterElement/ConditionOptions";
import { ConditionSelected } from "../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../FilterElement/FilterElement";
import { areFilterContainersEqual, getFilterContainerKey, hasUnsavedFilterChanges } from "./utils";

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

  it("treats in-place right-operator edits as unsaved against a committed snapshot", () => {
    // Arrange — provider and editor share the same FilterElement instance
    const element = new FilterElement(
      new ExpressionValue("attribute", "Attribute", "attribute"),
      new Condition(
        ConditionOptions.fromName("REFERENCE"),
        new ConditionSelected(
          [{ label: "Banana\n700ml", value: "v-1", slug: "v-1" }],
          { type: "multiselect", label: "in", value: "input-2" },
          [],
          false,
        ),
        false,
      ),
      false,
      undefined,
      new ExpressionValue("referenced-product", "Referenced product", "REFERENCE"),
    );
    const container = [element];
    const committedKey = getFilterContainerKey(container);

    // Act
    element.updateRightOperator([
      { label: "Banana\n700ml", value: "v-1", slug: "v-1" },
      { label: "Hoodie\nDefault", value: "v-2", slug: "v-2" },
    ]);

    // Assert — live provider comparison cannot see the edit
    expect(areFilterContainersEqual(container, container)).toBe(true);
    expect(hasUnsavedFilterChanges(container, committedKey)).toBe(true);
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
