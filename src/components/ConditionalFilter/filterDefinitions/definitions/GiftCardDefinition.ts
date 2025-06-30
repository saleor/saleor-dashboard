import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { mapStaticQueryPartToLegacyVariables } from "../../QueryBuilder/utils";
import { BothApiFilterDefinition } from "../types";
import { getBooleanValueFromElement } from "../utils";

export class GiftCardDefinition implements BothApiFilterDefinition<any> {
  canHandle(element: FilterElement): boolean {
    return ["isActive", "used", "tag"].includes(element.value.value);
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQuery(query: Readonly<any>, element: FilterElement): any {
    const { value: selectedValue } = element.condition.selected;
    const fieldName = element.value.value;
    let queryPart;

    if (fieldName === "isActive" && isItemOption(selectedValue)) {
      const boolValue = getBooleanValueFromElement(element);

      queryPart = { eq: boolValue };
    } else if (isItemOption(selectedValue)) {
      queryPart = { eq: selectedValue.value };
    } else {
      queryPart = { eq: selectedValue };
    }

    return { ...query, [fieldName]: queryPart };
  }

  updateFilterQuery(query: Readonly<any>, element: FilterElement): any {
    const { value: selectedValue } = element.condition.selected;
    const fieldName = element.value.value;

    if (fieldName === "isActive" && isItemOption(selectedValue)) {
      return { ...query, [fieldName]: getBooleanValueFromElement(element) };
    }

    const whereQuery = this.updateWhereQuery(query, element);

    return {
      ...query,
      [fieldName]: mapStaticQueryPartToLegacyVariables(whereQuery[fieldName]),
    };
  }
}
