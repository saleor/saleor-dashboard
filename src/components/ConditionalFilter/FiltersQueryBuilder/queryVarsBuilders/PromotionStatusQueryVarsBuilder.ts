import { DiscountStatusEnum, type PromotionWhereInput } from "@dashboard/graphql";

import { type Handler, NoopValuesHandler } from "../../API/Handler";
import { type FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray } from "../../FilterElement/ConditionValue";
import { type WhereOnlyQueryVarsBuilder } from "./types";

/**
 * PromotionWhereInput has no `status` field. Map DiscountStatusEnum choices to
 * start/end date ranges that approximate Active / Scheduled / Ended.
 *
 * Active open-ended promotions (null endDate) cannot be expressed with
 * DateTimeFilterInput (no isnull). Bounded actives (start ≤ now ≤ end) match;
 * open-ended live promotions are a known API gap until status lands on WHERE.
 */
export class PromotionStatusQueryVarsBuilder
  implements WhereOnlyQueryVarsBuilder<PromotionWhereInput>
{
  canHandle(element: FilterElement): boolean {
    return element.value.value === "promotionStatus";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQueryVariables(
    query: Readonly<PromotionWhereInput>,
    element: FilterElement,
  ): PromotionWhereInput {
    return this.buildWhereQueryVariables(query, element, new Date());
  }

  /** Exposed for tests so status→date mapping is deterministic. */
  buildWhereQueryVariables(
    query: Readonly<PromotionWhereInput>,
    element: FilterElement,
    now: Date,
  ): PromotionWhereInput {
    const { value: selectedValue } = element.condition.selected;
    let statuses: DiscountStatusEnum[] = [];

    if (isItemOptionArray(selectedValue)) {
      statuses = selectedValue.map(item => item.value as DiscountStatusEnum);
    } else if (isItemOption(selectedValue)) {
      statuses = [selectedValue.value as DiscountStatusEnum];
    }

    if (statuses.length === 0) {
      return { ...query };
    }

    const nowIso = now.toISOString();
    const statusClauses = statuses.map(status => statusToWhereClause(status, nowIso));
    const statusWhere: PromotionWhereInput =
      statusClauses.length === 1 ? statusClauses[0] : { OR: statusClauses };

    return {
      ...query,
      AND: [...(query.AND ?? []), statusWhere],
    };
  }
}

function statusToWhereClause(status: DiscountStatusEnum, nowIso: string): PromotionWhereInput {
  switch (status) {
    case DiscountStatusEnum.SCHEDULED:
      return { startDate: { range: { gte: nowIso } } };
    case DiscountStatusEnum.EXPIRED:
      return { endDate: { range: { lte: nowIso } } };
    case DiscountStatusEnum.ACTIVE:
      return {
        AND: [{ startDate: { range: { lte: nowIso } } }, { endDate: { range: { gte: nowIso } } }],
      };
  }
}
