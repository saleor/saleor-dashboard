import { type PriceRangeInput } from "@dashboard/graphql";

import { type Handler, NoopValuesHandler } from "../../API/Handler";
import { type FilterElement } from "../../FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { type FilterOnlyQueryVarsBuilder } from "./types";

const SUPPORTED_PRICE_RANGE_FILTERS = new Set(["price", "minimalPrice"] as const);

type SupportedPriceRangeKeys =
  typeof SUPPORTED_PRICE_RANGE_FILTERS extends Set<infer T> ? T : never;

type PriceRangeQueryPart = {
  price?: PriceRangeInput;
  minimalPrice?: PriceRangeInput;
};

/**
 * Handles price filtering for FILTER API only.
 *
 * Note: This builder only supports the legacy FILTER API because PriceRangeInput
 * (simple { gte?, lte? } format) is specific to the FILTER API. The WHERE API
 * uses PriceFilterInput instead (which has a different shape with amount wrapper).
 *
 * @see PriceFilterQueryVarsBuilder for WHERE API price filtering (totalGross, totalNet)
 */
export class PriceRangeQueryVarsBuilder implements FilterOnlyQueryVarsBuilder<PriceRangeQueryPart> {
  canHandle(element: FilterElement): boolean {
    return SUPPORTED_PRICE_RANGE_FILTERS.has(element.value.value as SupportedPriceRangeKeys);
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateFilterQueryVariables(
    query: Readonly<PriceRangeQueryPart>,
    element: FilterElement,
  ): PriceRangeQueryPart {
    const fieldName = element.value.value as keyof PriceRangeQueryPart;
    const processedValue = this.getConditionValue(element);

    return { ...query, [fieldName]: processedValue };
  }

  private getConditionValue(element: FilterElement): PriceRangeInput | null {
    const amountParsed = QueryVarsBuilderUtils.getFloatValueFromElement(element);
    const conditionLabel = element.condition.selected.conditionValue?.label || "";

    if (amountParsed === null) {
      return null;
    }

    if (conditionLabel === "is") {
      if (Array.isArray(amountParsed)) {
        return null;
      }

      return { gte: amountParsed, lte: amountParsed };
    }

    if (conditionLabel === "greater") {
      if (Array.isArray(amountParsed)) {
        return null;
      }

      return { gte: amountParsed };
    }

    if (conditionLabel === "lower") {
      if (Array.isArray(amountParsed)) {
        return null;
      }

      return { lte: amountParsed };
    }

    if (conditionLabel === "between") {
      if (!Array.isArray(amountParsed) || amountParsed.length !== 2) {
        return null;
      }

      const [gte, lte] = amountParsed;

      return { gte, lte };
    }

    return null;
  }
}
