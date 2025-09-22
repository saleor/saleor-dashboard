import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { WhereOnlyQueryVarsBuilder } from "./types";

type FulfillmentStatusFilterQueryPart = {
  fulfillments?: Array<{
    status?: { eq?: string; oneOf?: string[] };
  }>;
};

/** Builds query for fulfillment status nested in array structure
 *
 * E.g. {fulfilments: [{status: {eq: "abc"}}]} */
export class FulfillmentStatusQueryVarsBuilder
  implements WhereOnlyQueryVarsBuilder<FulfillmentStatusFilterQueryPart>
{
  canHandle(element: FilterElement): boolean {
    return element.value.type === "fulfillmentStatus";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQueryVariables(
    query: Readonly<FulfillmentStatusFilterQueryPart>,
    element: FilterElement,
  ): FulfillmentStatusFilterQueryPart {
    const conditionValue = QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element);

    if (!conditionValue) {
      return query as FulfillmentStatusFilterQueryPart;
    }

    const newQuery = { ...query };
    const existingArray = newQuery.fulfillments || [];

    // Each fulfillment status filter creates a new array element
    const newElement = {
      status: conditionValue as { eq?: string; oneOf?: string[] },
    };

    newQuery.fulfillments = [...existingArray, newElement];

    return newQuery;
  }
}
