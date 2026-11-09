import { DiscountStatusEnum, type PromotionWhereInput } from "@dashboard/graphql";

import { type Handler, NoopValuesHandler } from "../../API/Handler";
import { isItemOption, isItemOptionArray } from "../../FilterElement/ConditionValue";
import { type FilterElement } from "../../FilterElement/FilterElement";
import { type WhereOnlyQueryVarsBuilder } from "./types";

/**
 * PromotionWhereInput has no `status` field. Map DiscountStatusEnum choices to start and end
 * dates the same way the list's Status column reads them (`getPromotionStatus`): Scheduled has
 * not started, Ended has an end in the past, and Active has started and has no end or an end
 * still ahead.
 */
export class PromotionStatusQueryVarsBuilder implements WhereOnlyQueryVarsBuilder<PromotionWhereInput> {
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
      // A promotion that hasn't started counts as Scheduled, even with an end date in the past.
      return {
        AND: [{ startDate: { range: { lte: nowIso } } }, { endDate: { range: { lte: nowIso } } }],
      };
    case DiscountStatusEnum.ACTIVE:
      return {
        AND: [
          { startDate: { range: { lte: nowIso } } },
          // `eq: null` matches promotions without an end date. Leaving the key out would match
          // every promotion instead.
          { OR: [{ endDate: { eq: null } }, { endDate: { range: { gte: nowIso } } }] },
        ],
      };
  }
}
