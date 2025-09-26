import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOptionArray } from "../../FilterElement/ConditionValue";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

type OrderIdFilterQueryPart = {
  ids?: string[];
};

/** Maps IDs for OrderWhereInput to a simple array, instead of `{oneOf: []}` object */
export class OrderIdQueryVarsBuilder extends BaseMappableQueryVarsBuilder<OrderIdFilterQueryPart> {
  canHandle(element: FilterElement): boolean {
    return element.value.value === "ids";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(element: FilterElement): string {
    return element.value.value;
  }

  protected getConditionValue(
    element: FilterElement,
  ): OrderIdFilterQueryPart[keyof OrderIdFilterQueryPart] {
    const { value: selectedValue } = element.condition.selected;

    // For IDs, we need to return plain array, not {oneOf: [...]} structure
    // See OrderWhereInput.ids type in Saleor Schema
    if (isItemOptionArray(selectedValue)) {
      return selectedValue.map(x => x.originalSlug || x.value);
    }

    if (Array.isArray(selectedValue) && typeof selectedValue[0] === "string") {
      return selectedValue;
    }

    // Single ID as array
    if (typeof selectedValue === "string") {
      return [selectedValue];
    }

    return [];
  }
}
