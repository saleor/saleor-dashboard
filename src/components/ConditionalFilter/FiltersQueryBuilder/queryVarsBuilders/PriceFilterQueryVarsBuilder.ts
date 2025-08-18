import { ApolloClient } from "@apollo/client";
import { DecimalFilterInput, PriceFilterInput } from "@dashboard/graphql";

import { CurrencyHandler, Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

const SUPPORTED_PRICE_FILTERS = new Set([
  "totalGross",
  "totalNet",
] as const);

type SupportedPriceKeys =
  typeof SUPPORTED_PRICE_FILTERS extends Set<infer T> ? T : never;

export type PriceFilterQueryPart = {
  totalGross?: PriceFilterInput;
  totalNet?: PriceFilterInput;
};

export class PriceFilterQueryVarsBuilder
  extends BaseMappableQueryVarsBuilder<PriceFilterQueryPart> {
  canHandle(element: FilterElement): boolean {
    return SUPPORTED_PRICE_FILTERS.has(element.value.value as SupportedPriceKeys);
  }

  createOptionFetcher(
    client: ApolloClient<unknown>,
    inputValue: string,
    element: FilterElement,
  ): Handler {
    if (element.value.value === "currency") {
      return new CurrencyHandler(client, inputValue);
    }

    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(element: FilterElement): string {
    return element.value.value;
  }

  protected getConditionValue(element: FilterElement): PriceFilterInput {
    const amountParsed = QueryVarsBuilderUtils.getFloatValueFromElement(element);
    const decimalInput = QueryVarsBuilderUtils.handleRangeCondition(amountParsed, element.condition.selected.conditionValue.label) as DecimalFilterInput;


    // For now, we don't extract currency from the filter element
    // This could be extended if currency filtering is needed
    const priceFilter: PriceFilterInput = { amount: decimalInput };

    return priceFilter;
  }
}
