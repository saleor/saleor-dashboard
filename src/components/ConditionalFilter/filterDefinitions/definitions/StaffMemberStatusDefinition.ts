import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { mapStaticQueryPartToLegacyVariables } from "../../QueryBuilder/utils";
import { BothApiFilterDefinition, FilterQuery } from "../types";

export class StaffMemberStatusDefinition implements BothApiFilterDefinition<FilterQuery> {
  canHandle(element: FilterElement): boolean {
    return element.value.value === "staffMemberStatus";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQuery(query: Readonly<FilterQuery>, element: FilterElement): FilterQuery {
    const { value: selectedValue } = element.condition.selected;
    let queryPart;

    if (isItemOption(selectedValue)) {
      queryPart = { eq: selectedValue.value };
    } else {
      queryPart = { eq: selectedValue };
    }

    return { ...query, status: queryPart };
  }

  updateFilterQuery(query: Readonly<FilterQuery>, element: FilterElement): FilterQuery {
    const whereQuery = this.updateWhereQuery(query, element);

    return {
      ...query,
      status: mapStaticQueryPartToLegacyVariables(whereQuery.status),
    };
  }
}
