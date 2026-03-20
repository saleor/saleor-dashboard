import { type DecimalFilterInput, type PriceFilterInput } from "@dashboard/graphql";

import { type Handler, NoopValuesHandler } from "../../API/Handler";
import { type FilterElement } from "../../FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

const SUPPORTED_PRICE_FILTERS = new Set(["totalGross", "totalNet"] as const);

type SupportedPriceKeys = typeof SUPPORTED_PRICE_FILTERS extends Set<infer T> ? T : never;

type PriceFilterQueryPart = {
  totalGross?: PriceFilterInput;
  totalNet?: PriceFilterInput;
};

export class PriceFilterQueryVarsBuilder extends BaseMappableQueryVarsBuilder<PriceFilterQueryPart> {
  canHandle(element: FilterElement): boolean {
    return SUPPORTED_PRICE_FILTERS.has(element.value.value as SupportedPriceKeys);
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(element: FilterElement): string {
    return element.value.value;
  }

  protected getConditionValue(element: FilterElement): PriceFilterInput | null {
    const amountParsed = QueryVarsBuilderUtils.getFloatValueFromElement(element);
    const conditionLabel = element.condition.selected.conditionValue?.label || "";
    const decimalInput = QueryVarsBuilderUtils.buildNumericRangeCondition(
      amountParsed,
      conditionLabel,
    ) as DecimalFilterInput | null;

    if (decimalInput === null) {
      return null;
    }

    // For now, we don't extract currency from the filter element
    // This could be extended if currency filtering is needed
    const priceFilter: PriceFilterInput = { amount: decimalInput };

    return priceFilter;
  }
}
