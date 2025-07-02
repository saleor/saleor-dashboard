import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray, isTuple } from "../../FilterElement/ConditionValue";
import { BothApiFilterDefinition, FilterQuery } from "../types";

export class DefaultDefinition implements BothApiFilterDefinition<FilterQuery> {
  public canHandle(): boolean {
    // Default definition handles all elements that no other definition can handle
    return true;
  }

  public createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  private processValue(element: FilterElement, forWhere: boolean) {
    const { value: selectedValue, conditionValue } = element.condition.selected;

    if (!conditionValue) {
      return "";
    }

    const { label } = conditionValue;

    if (label === "lower") {
      const value = isItemOption(selectedValue) ? selectedValue.value : selectedValue;
      const range = { lte: value };

      return forWhere ? { range } : range;
    }

    if (label === "greater") {
      const value = isItemOption(selectedValue) ? selectedValue.value : selectedValue;
      const range = { gte: value };

      return forWhere ? { range } : range;
    }

    if (isTuple(selectedValue) && label === "between") {
      const [gte, lte] = selectedValue;
      const range = { gte, lte };

      return forWhere ? { range } : range;
    }

    if (isItemOption(selectedValue) && ["true", "false"].includes(selectedValue.value)) {
      return selectedValue.value === "true";
    }

    if (isItemOption(selectedValue)) {
      const eq = selectedValue.value;

      return forWhere ? { eq } : eq;
    }

    if (isItemOptionArray(selectedValue)) {
      const oneOf = selectedValue.map(x => x.value);

      return forWhere ? { oneOf } : oneOf;
    }

    if (typeof selectedValue === "string") {
      // Convert string boolean values to actual booleans
      if (["true", "false"].includes(selectedValue)) {
        return selectedValue === "true";
      }

      const eq = selectedValue;

      return forWhere ? { eq } : eq;
    }

    if (Array.isArray(selectedValue)) {
      const eq = selectedValue;

      return forWhere ? { eq } : eq;
    }

    return selectedValue;
  }

  public updateWhereQuery(query: Readonly<FilterQuery>, element: FilterElement): FilterQuery {
    const fieldName = element.value.value || element.value.label || "unknown";
    const processedValue = this.processValue(element, true);

    return { ...query, [fieldName]: processedValue };
  }

  public updateFilterQuery(query: Readonly<FilterQuery>, element: FilterElement): FilterQuery {
    const fieldName = element.value.value || element.value.label || "unknown";
    const processedValue = this.processValue(element, false);

    return { ...query, [fieldName]: processedValue };
  }
}
