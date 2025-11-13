import { Condition, FilterElement } from "../FilterElement";
import { ConditionOptions } from "../FilterElement/ConditionOptions";
import { ConditionSelected } from "../FilterElement/ConditionSelected";
import { ExpressionValue } from "../FilterElement/FilterElement";
import { validateMetadataFilterElement } from "./metadata";

describe("Metadata validator", () => {
  const createElement = (key: string, value: string): FilterElement => {
    return new FilterElement(
      new ExpressionValue("metadata", "Metadata", "metadata"),
      new Condition(
        ConditionOptions.fromStaticElementName("metadata"),
        new ConditionSelected(
          [key, value],
          {
            type: "text.double",
            value: "input-1",
            label: "is",
          },
          [],
          false,
        ),
        false,
      ),
      false,
    );
  };

  it("should return false when key and value are provided", () => {
    const element = createElement("test-key", "test-value");
    const result = validateMetadataFilterElement(element, 0);

    expect(result).toBe(false);
  });

  it("should return false when key is provided and value is empty (WHERE API)", () => {
    const element = createElement("test-key", "");
    const result = validateMetadataFilterElement(element, 0);

    expect(result).toBe(false);
  });

  it("should return error when key is empty", () => {
    const element = createElement("", "test-value");
    const result = validateMetadataFilterElement(element, 0);

    expect(result).toEqual({
      row: 0,
      rightText: "Metadata key is required",
    });
  });

  it("should return error when key is only whitespace", () => {
    const element = createElement("   ", "test-value");
    const result = validateMetadataFilterElement(element, 0);

    expect(result).toEqual({
      row: 0,
      rightText: "Metadata key is required",
    });
  });

  it("should return error when both key and value are empty", () => {
    const element = createElement("", "");
    const result = validateMetadataFilterElement(element, 0);

    expect(result).toEqual({
      row: 0,
      rightText: "Metadata key is required",
    });
  });
});
