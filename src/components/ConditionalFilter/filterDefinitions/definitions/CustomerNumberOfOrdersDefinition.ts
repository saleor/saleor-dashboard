import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { mapStaticQueryPartToLegacyVariables } from "../../QueryBuilder/utils";
import { BothApiFilterDefinition } from "../types";

export class CustomerNumberOfOrdersDefinition
  implements BothApiFilterDefinition<{ numberOfOrders?: { gte: string; lte: string } }>
{
  canHandle(element: FilterElement): boolean {
    return element.value.value === "numberOfOrders";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQuery(
    query: Readonly<{ numberOfOrders?: { gte: string; lte: string } }>,
    element: FilterElement,
  ): { numberOfOrders?: { gte: string; lte: string } } {
    const { value: selectedValue } = element.condition.selected;

    if (Array.isArray(selectedValue) && selectedValue.length === 2) {
      const gte = isItemOption(selectedValue[0])
        ? selectedValue[0].value
        : String(selectedValue[0]);
      const lte = isItemOption(selectedValue[1])
        ? selectedValue[1].value
        : String(selectedValue[1]);

      return {
        ...query,
        numberOfOrders: { gte, lte },
      };
    }

    return query;
  }

  updateFilterQuery(
    query: Readonly<{ numberOfOrders?: { gte: string; lte: string } }>,
    element: FilterElement,
  ): { numberOfOrders?: { gte: string; lte: string } } {
    const whereQuery = this.updateWhereQuery(query, element);

    return {
      ...query,
      numberOfOrders: whereQuery.numberOfOrders
        ? mapStaticQueryPartToLegacyVariables(whereQuery.numberOfOrders)
        : undefined,
    };
  }
}
