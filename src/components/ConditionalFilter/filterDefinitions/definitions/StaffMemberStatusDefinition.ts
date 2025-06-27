import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { mapStaticQueryPartToLegacyVariables } from "../../QueryBuilder/utils";
import { BothApiFilterDefinition } from "../types";

export class StaffMemberStatusDefinition implements BothApiFilterDefinition<any> {
  canHandle(element: FilterElement): boolean {
    return element.value.value === "staffMemberStatus";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQuery(query: Readonly<any>, element: FilterElement): any {
    const { value: selectedValue } = element.condition.selected;
    let queryPart;

    if (isItemOption(selectedValue)) {
      queryPart = { eq: selectedValue.value };
    } else {
      queryPart = { eq: selectedValue };
    }

    return { ...query, status: queryPart };
  }

  updateFilterQuery(query: Readonly<any>, element: FilterElement): any {
    const whereQuery = this.updateWhereQuery(query, element);

    return {
      ...query,
      status: mapStaticQueryPartToLegacyVariables(whereQuery.status),
    };
  }
}
