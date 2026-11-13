import { type PromotionWhereInput } from "@dashboard/graphql";

import { type Handler, NoopValuesHandler } from "../../API/Handler";
import { type FilterElement } from "../../FilterElement/FilterElement";
import { QueryVarsDateUtils } from "../dateUtils";
import { type WhereOnlyQueryVarsBuilder } from "./types";

const PROMOTION_DATE_FIELDS = ["startDate", "endDate"] as const;

type PromotionDateField = (typeof PROMOTION_DATE_FIELDS)[number];

const isPromotionDateField = (field: string): field is PromotionDateField =>
  (PROMOTION_DATE_FIELDS as readonly string[]).includes(field);

/**
 * Promotion start and end date filters, sent as `{ range: { gte, lte } }`.
 *
 * The filter bar gives a `datetime-local` value in the browser's time zone. The API reads a bare
 * value as UTC, so it's converted to an instant first. A "between" with one bound empty filters by
 * the bound that is set: an empty bound makes the API reject the whole list query.
 */
export class PromotionDateQueryVarsBuilder implements WhereOnlyQueryVarsBuilder<PromotionWhereInput> {
  canHandle(element: FilterElement): boolean {
    return isPromotionDateField(element.value.value);
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQueryVariables(
    query: Readonly<PromotionWhereInput>,
    element: FilterElement,
  ): PromotionWhereInput {
    const field = element.value.value;
    const { value, conditionValue } = element.condition.selected;

    // The resolver only hands over elements canHandle accepted; checking again narrows the field
    // name without a type assertion.
    if (!isPromotionDateField(field) || !conditionValue) {
      return { ...query };
    }

    const range = QueryVarsDateUtils.buildDateFilter(value, conditionValue.label);

    return range ? { ...query, [field]: { range } } : { ...query };
  }
}
