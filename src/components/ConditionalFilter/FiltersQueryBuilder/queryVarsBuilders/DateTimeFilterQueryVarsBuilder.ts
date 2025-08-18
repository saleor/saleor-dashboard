import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption, isTuple } from "../../FilterElement/ConditionValue";
import { QueryVarsDateUtils } from "../dateUtils";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

export type DateTimeFilterQueryPart = {
  updatedAt?: { eq?: string; oneOf?: string[]; range?: { gte?: string; lte?: string } };
  startDate?: { eq?: string; oneOf?: string[]; range?: { gte?: string; lte?: string } };
  endDate?: { eq?: string; oneOf?: string[]; range?: { gte?: string; lte?: string } };
};

/**
 * Query builder for fields using DateTimeFilterInput pattern
 * Generates {eq: value} for single values and {range: {gte, lte}} for ranges
 * 
 * Used by ProductWhereInput.updatedAt, PromotionWhereInput.startDate/endDate
 */
class DateTimeFilterQueryVarsBuilder extends BaseMappableQueryVarsBuilder<DateTimeFilterQueryPart> {
  // Fields that use `DateTimeFilterInput` input, not `DateTimeRangeInput`
  private static readonly ALLOWED_FIELDS = [
    "updatedAt",   // ProductWhereInput.updatedAt
    "startDate",   // PromotionWhereInput.startDate
    "endDate",     // PromotionWhereInput.endDate
  ];

  public canHandle(element: FilterElement): boolean {
    const fieldName = element.value.value || element.value.label || "";

    const isAllowed = DateTimeFilterQueryVarsBuilder.ALLOWED_FIELDS.includes(fieldName);

    if (!isAllowed) {
      // In this case field should be handled by DefaultQueryVarsBuilder
      return false;
    }

    return true;
  }

  public createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(element: FilterElement): string {
    return element.value.value || element.value.label || "unknown";
  }

  protected getConditionValue(element: FilterElement): DateTimeFilterQueryPart[keyof DateTimeFilterQueryPart] | undefined {
    const { value: selectedValue, conditionValue } = element.condition.selected;

    if (!conditionValue) {
      return undefined;
    }

    const { label } = conditionValue;

    // Handle range conditions with DateTimeFilterInput format
    if (label === "lower") {
      const stringValue = isItemOption(selectedValue) ? selectedValue.value : String(selectedValue);
      const value = QueryVarsDateUtils.formatDateTime(stringValue);

      if (!value) {
        return undefined;
      }

      return { range: { lte: value } };
    }

    if (label === "greater") {
      const stringValue = isItemOption(selectedValue) ? selectedValue.value : String(selectedValue);
      const value = QueryVarsDateUtils.formatDateTime(stringValue);

      if (!value) {
        return undefined;
      }

      return { range: { gte: value } };
    }

    if (isTuple(selectedValue) && label === "between") {
      const [gteValue, lteValue] = selectedValue;
      const gteFormatted = QueryVarsDateUtils.formatDateTime(gteValue);
      const lteFormatted = QueryVarsDateUtils.formatDateTime(lteValue);

      if (!gteFormatted || !lteFormatted) {
        return undefined;
      }

      return { range: { gte: gteFormatted, lte: lteFormatted } };
    }

    // Handle single date values with DateTimeFilterInput format
    if (typeof selectedValue === "string" || isItemOption(selectedValue)) {
      const value = isItemOption(selectedValue) ? selectedValue.value : selectedValue;
      const formattedValue = QueryVarsDateUtils.formatDateTime(value);

      if (!formattedValue) {
        return undefined;
      }

      return { eq: formattedValue };
    }

    return undefined;
  }
}
