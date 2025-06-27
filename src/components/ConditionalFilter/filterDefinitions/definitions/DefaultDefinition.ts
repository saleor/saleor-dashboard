import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray } from "../../FilterElement/ConditionValue";
import { BothApiFilterDefinition } from "../types";

export class DefaultDefinition implements BothApiFilterDefinition<any> {
  public canHandle(): boolean {
    // Default definition handles all elements that no other definition can handle
    return true;
  }

  public createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  private processValue(element: FilterElement): any {
    const { value: selectedValue, conditionValue } = element.condition.selected;
    const conditionType = conditionValue?.type;
    const conditionLabel = conditionValue?.label;

    // Handle range types
    if (
      conditionType === "datetime.range" ||
      conditionType === "date.range" ||
      conditionType === "number.range"
    ) {
      if (Array.isArray(selectedValue) && selectedValue.length === 2) {
        const gte =
          typeof selectedValue[0] === "string" ? selectedValue[0] : String(selectedValue[0]);
        const lte =
          typeof selectedValue[1] === "string" ? selectedValue[1] : String(selectedValue[1]);

        return { gte, lte };
      }
    }

    // Handle "greater" condition
    if (conditionLabel === "greater") {
      const value = isItemOption(selectedValue) ? selectedValue.value : String(selectedValue);

      return { gte: value };
    }

    // Handle "lower" condition
    if (conditionLabel === "lower") {
      const value = isItemOption(selectedValue) ? selectedValue.value : String(selectedValue);

      return { lte: value };
    }

    // Handle boolean conversion for select types
    if (conditionType === "select" && isItemOption(selectedValue)) {
      const value = selectedValue.value;

      if (value === "true" || value === "false") {
        return value === "true";
      }
    }

    // Handle regular cases
    if (isItemOption(selectedValue)) {
      return selectedValue.value;
    } else if (isItemOptionArray(selectedValue)) {
      return selectedValue.map(item => item.value);
    }

    return selectedValue;
  }

  public updateWhereQuery(query: Readonly<any>, element: FilterElement): any {
    const fieldName = element.value.value || element.value.label || "unknown";
    const processedValue = this.processValue(element);

    // If it's already a range object, use it directly
    if (
      typeof processedValue === "object" &&
      (processedValue.gte !== undefined || processedValue.lte !== undefined)
    ) {
      return { ...query, [fieldName]: processedValue };
    }

    // For arrays, use oneOf
    if (Array.isArray(processedValue)) {
      return { ...query, [fieldName]: { oneOf: processedValue } };
    }

    // For simple values, use eq
    return { ...query, [fieldName]: { eq: processedValue } };
  }

  public updateFilterQuery(query: Readonly<any>, element: FilterElement): any {
    const fieldName = element.value.value || element.value.label || "unknown";
    const processedValue = this.processValue(element);

    // For range objects, use them directly
    if (
      typeof processedValue === "object" &&
      (processedValue.gte !== undefined || processedValue.lte !== undefined)
    ) {
      return { ...query, [fieldName]: processedValue };
    }

    // For other cases, use the processed value directly
    return { ...query, [fieldName]: processedValue };
  }
}
