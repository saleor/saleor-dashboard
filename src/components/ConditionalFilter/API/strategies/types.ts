import { ApolloClient } from "@apollo/client";
import { AttributeInput } from "@dashboard/graphql";

import { FilterElement } from "../../FilterElement";
import { StaticQueryPart } from "../../queryVariables";
import { Handler } from "../Handler";

export interface FilterHandlerStrategy {
  canHandle(filterElement: FilterElement): boolean;

  createHandler(
    client: ApolloClient<unknown>,
    inputValue: string,
    filterElement: FilterElement,
  ): Handler;

  buildQueryPart(filterElement: FilterElement): AttributeInput | StaticQueryPart;
}
