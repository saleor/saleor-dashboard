import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { BothApiFilterDefinition } from "../types";

export class StaticBooleanDefinition implements BothApiFilterDefinition<any> {
  canHandle(element: FilterElement): boolean {
    return ["isPublished", "hasCategory", "hasVariants"].includes(element.value.value);
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQuery(query: Readonly<any>, element: FilterElement): any {
    const { value: selectedValue } = element.condition.selected;
    const fieldName = element.value.value;
    let booleanValue: boolean;

    if (isItemOption(selectedValue)) {
      booleanValue = selectedValue.value === "true";
    } else if (typeof selectedValue === "boolean") {
      booleanValue = selectedValue;
    } else {
      booleanValue = String(selectedValue) === "true";
    }

    return { ...query, [fieldName]: booleanValue };
  }

  updateFilterQuery(query: Readonly<any>, element: FilterElement): any {
    const whereQuery = this.updateWhereQuery(query, element);
    const fieldName = element.value.value;

    return {
      ...query,
      [fieldName]: whereQuery[fieldName], // Boolean values don't need legacy mapping
    };
  }
}
