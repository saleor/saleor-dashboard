import { Condition, FilterElement } from "../FilterElement";
import { ConditionOptions } from "../FilterElement/ConditionOptions";
import { ConditionSelected } from "../FilterElement/ConditionSelected";
import { ExpressionValue } from "../FilterElement/FilterElement";
import { validateFilterElementToBeNumeric } from "./numeric";

describe("ConditionalFilter / validation / numeric", () => {
  it.each([
    ["12345678901234567890123456", { rightText: "The value is too long.", row: 0 }],
    ["123", false],
    [["123", "321"], false],
    [["100", "1"], { rightText: "The value must be higher", row: 0 }],
  ])("should validate %p", (value, expected) => {
    // Arrange
    const element = new FilterElement(
      new ExpressionValue("price", "Price", "price"),
      new Condition(
        ConditionOptions.fromStaticElementName("price"),
        new ConditionSelected(
          value,
          {
            type: "price",
            value: "price",
            label: "Price",
          },
          [],
          false,
        ),
        false,
      ),
      false,
    );
    // Act
    const result = validateFilterElementToBeNumeric(element, 0);

    // Assert
    expect(result).toEqual(expected);
  });
});
