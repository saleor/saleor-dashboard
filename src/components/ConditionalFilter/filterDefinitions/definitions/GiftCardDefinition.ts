import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { mapStaticQueryPartToLegacyVariables } from "../../QueryBuilder/utils";
import { BothApiFilterDefinition, FilterQuery } from "../types";

export class GiftCardDefinition implements BothApiFilterDefinition<FilterQuery> {
  canHandle(element: FilterElement): boolean {
    return ["used", "tag"].includes(element.value.value);
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQuery(query: Readonly<FilterQuery>, element: FilterElement): FilterQuery {
    const { value: selectedValue } = element.condition.selected;
    const fieldName = element.value.value;
    let queryPart;

    if (isItemOption(selectedValue)) {
      queryPart = { eq: selectedValue.value };
    } else {
      queryPart = { eq: selectedValue };
    }

    return { ...query, [fieldName]: queryPart };
  }

  updateFilterQuery(query: Readonly<FilterQuery>, element: FilterElement): FilterQuery {
    const whereQuery = this.updateWhereQuery(query, element);
    const fieldName = element.value.value;

    return {
      ...query,
      [fieldName]: mapStaticQueryPartToLegacyVariables(
        whereQuery[fieldName] as { eq?: string; oneOf?: string[] },
      ),
    };
  }
}
