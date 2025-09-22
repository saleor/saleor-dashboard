import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { QueryVarsDateUtils } from "../dateUtils";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

type DateTimeRangeQueryVars = {
  createdAt?: { gte?: string; lte?: string };
  updatedAt?: { gte?: string; lte?: string };
  dateJoined?: { gte?: string; lte?: string };
};

/**
 * Query builder for fields using DateTimeRangeQuery pattern
 * Generates {gte: value, lte: value} for ranges
 *
 * For fields using DateTimeFilterInput pattern, use DefaultQueryVarsBuilder
 */
export class DateTimeRangeQueryVarsBuilder extends BaseMappableQueryVarsBuilder<DateTimeRangeQueryVars> {
  private static readonly DATE_FIELD_NAMES = ["createdAt", "updatedAt", "dateJoined"];

  canHandle(element: FilterElement): boolean {
    const fieldName = element.value.value || element.value.label || "";

    return DateTimeRangeQueryVarsBuilder.DATE_FIELD_NAMES.includes(fieldName);
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(element: FilterElement): string {
    return element.value.value || element.value.label || "unknown";
  }

  protected getConditionValue(
    element: FilterElement,
  ): DateTimeRangeQueryVars[keyof DateTimeRangeQueryVars] | undefined {
    const { value: selectedValue, conditionValue } = element.condition.selected;

    if (!conditionValue) {
      return undefined;
    }

    const { label } = conditionValue;

    return QueryVarsDateUtils.buildDateFilter(selectedValue, label);
  }
}
