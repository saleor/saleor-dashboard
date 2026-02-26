import { type IntFilterInput } from "@dashboard/graphql";

import { type Handler, NoopValuesHandler } from "../../API/Handler";
import { type FilterElement } from "../../FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

const SUPPORTED_INT_FILTERS = new Set(["linesCount", "number"] as const);

type SupportedIntKeys = typeof SUPPORTED_INT_FILTERS extends Set<infer T> ? T : never;

type IntFilterQueryPart = {
  linesCount?: IntFilterInput;
  number?: IntFilterInput;
};

/** Handle fields that use IntFilterInput type
 * E.g. `{linesCount: {range: {gte: 1, lte: 5}}}`
 *
 * For IntRangeInput, use DefaultQueryVarsBuilder
 * E.g. `{field: {gte: 1, lte: 5}}` */
export class IntFilterQueryVarsBuilder extends BaseMappableQueryVarsBuilder<IntFilterQueryPart> {
  canHandle(element: FilterElement): boolean {
    return SUPPORTED_INT_FILTERS.has(element.value.value as SupportedIntKeys);
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(element: FilterElement): string {
    return element.value.value || element.value.label || "unknown";
  }

  protected getConditionValue(element: FilterElement): IntFilterInput | null {
    const parsedValue = QueryVarsBuilderUtils.getIntegerValueFromElement(element);
    const conditionLabel = element.condition.selected.conditionValue?.label || "";

    return QueryVarsBuilderUtils.buildNumericRangeCondition(
      parsedValue,
      conditionLabel,
    ) as IntFilterInput | null;
  }
}
