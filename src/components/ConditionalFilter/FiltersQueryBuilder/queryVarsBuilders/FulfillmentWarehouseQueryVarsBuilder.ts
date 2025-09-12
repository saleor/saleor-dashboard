import { ApolloClient } from "@apollo/client";

import { Handler, WarehouseHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { WhereOnlyQueryVarsBuilder } from "./types";

export type FulfillmentWarehouseFilterQueryPart = {
  fulfillments?: Array<{
    warehouse?: {
      id?: { eq?: string; oneOf?: string[] };
    };
  }>;
};

/**
 * Builds query for warehouse filtering on order fulfillments
 * Maps fulfillmentWarehouse field to the nested structure:
 * fulfillments: [{ warehouse: { id: { eq: "warehouseId" } } }]
 */
export class FulfillmentWarehouseQueryVarsBuilder
  implements WhereOnlyQueryVarsBuilder<FulfillmentWarehouseFilterQueryPart>
{
  canHandle(element: FilterElement): boolean {
    return element.value.type === "fulfillmentWarehouse";
  }

  createOptionFetcher(client: ApolloClient<unknown>, inputValue: string): Handler {
    return new WarehouseHandler(client, inputValue);
  }

  updateWhereQueryVariables(
    query: Readonly<FulfillmentWarehouseFilterQueryPart>,
    element: FilterElement,
  ): FulfillmentWarehouseFilterQueryPart {
    const conditionValue = QueryVarsBuilderUtils.extractConditionValueFromFilterElement(
      element,
    ) as { eq?: string; oneOf?: string[] };

    if (!conditionValue || !(conditionValue?.oneOf || conditionValue?.eq)) {
      return query as FulfillmentWarehouseFilterQueryPart;
    }

    const newQuery = { ...query };
    const existingArray = newQuery.fulfillments || [];

    // Create new array element for fulfillments.warehouse.id
    const newElement = {
      warehouse: {
        id: conditionValue,
      },
    };

    newQuery.fulfillments = [...existingArray, newElement];

    return newQuery;
  }
}
