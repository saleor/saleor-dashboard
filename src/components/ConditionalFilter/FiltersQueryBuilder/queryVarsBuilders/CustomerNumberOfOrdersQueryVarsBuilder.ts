import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { QueryVarsBuilderUtils } from "../utils";
import { BothApiQueryVarsBuilder } from "./types";

export class CustomerNumberOfOrdersQueryVarsBuilder
  implements BothApiQueryVarsBuilder<{ numberOfOrders?: { gte: string; lte: string } }>
{
  canHandle(element: FilterElement): boolean {
    return element.value.value === "numberOfOrders";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQueryVariables(
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

  updateFilterQueryVariables(
    query: Readonly<{ numberOfOrders?: { gte: string; lte: string } }>,
    element: FilterElement,
  ): { numberOfOrders?: { gte: string; lte: string } } {
    const whereQuery = this.updateWhereQueryVariables(query, element);

    return {
      ...query,
      numberOfOrders: whereQuery.numberOfOrders
        ? (QueryVarsBuilderUtils.mapStaticQueryPartToLegacyVariables(whereQuery.numberOfOrders) as {
            gte: string;
            lte: string;
          })
        : undefined,
    };
  }
}
