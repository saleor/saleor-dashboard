import { FilterElement } from "../FilterElement";
import { isItemOption } from "../FilterElement/ConditionValue";

/**
 * Extracts a boolean value from a FilterElement's selected condition.
 * Handles various input formats: ItemOption with string values, direct boolean, or stringified values.
 */
export function getBooleanValueFromElement(element: FilterElement): boolean {
  const { value: selectedValue } = element.condition.selected;

  if (isItemOption(selectedValue)) {
    return selectedValue.value === "true";
  }

  if (typeof selectedValue === "boolean") {
    return selectedValue;
  }

  return String(selectedValue) === "true";
}
