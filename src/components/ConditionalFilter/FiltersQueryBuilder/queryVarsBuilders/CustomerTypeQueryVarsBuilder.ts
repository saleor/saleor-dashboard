import { type ApolloClient } from "@apollo/client";

import { CustomerTypeHandler, type Handler } from "../../API/Handler";
import { type FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray } from "../../FilterElement/ConditionValue";
import { type BothApiQueryVarsBuilder } from "./types";

type CustomerTypeQueryPart = { eq?: string } | { oneOf?: string[] };

/** Customer type only exists on CustomerWhereInput, not the deprecated CustomerFilterInput. */
export class CustomerTypeQueryVarsBuilder
  implements
    BothApiQueryVarsBuilder<{
      customerType?: CustomerTypeQueryPart;
    }>
{
  canHandle(element: FilterElement): boolean {
    return element.value.type === "customerType";
  }

  createOptionFetcher(client: ApolloClient<unknown>, inputValue: string): Handler {
    return new CustomerTypeHandler(client, inputValue);
  }

  updateWhereQueryVariables(
    query: Readonly<{ customerType?: CustomerTypeQueryPart }>,
    element: FilterElement,
  ): { customerType?: CustomerTypeQueryPart } {
    const { value: selectedValue } = element.condition.selected;
    let queryPart: CustomerTypeQueryPart | undefined;

    if (isItemOption(selectedValue)) {
      queryPart = { eq: selectedValue.value };
    } else if (isItemOptionArray(selectedValue)) {
      queryPart = { oneOf: selectedValue.map(item => item.value) };
    } else if (typeof selectedValue === "string") {
      queryPart = { eq: selectedValue };
    }

    return { ...query, customerType: queryPart };
  }

  updateFilterQueryVariables(query: Readonly<{ customerType?: CustomerTypeQueryPart }>): {
    customerType?: CustomerTypeQueryPart;
  } {
    return query;
  }
}
