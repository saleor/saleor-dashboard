import { VoucherFilterInput } from "@dashboard/graphql";

import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isTuple } from "../../FilterElement/ConditionValue";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";
import { FilterOnlyQueryVarsBuilder } from "./types";

type VoucherTimesUsedQuery = Pick<VoucherFilterInput, "timesUsed">;

export class VoucherTimesUsedQueryVarsBuilder
  extends BaseMappableQueryVarsBuilder<VoucherTimesUsedQuery>
  implements FilterOnlyQueryVarsBuilder<VoucherTimesUsedQuery>
{
  protected readonly queryField = "timesUsed" as const;

  canHandle(element: FilterElement): boolean {
    return element.value.value === "timesUsed";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(_element: FilterElement): string {
    return this.queryField;
  }

  protected getConditionValue(
    element: FilterElement,
  ): VoucherTimesUsedQuery[keyof VoucherTimesUsedQuery] {
    const { value: selectedValue, conditionValue } = element.condition.selected;

    if (conditionValue?.label === "is") {
      const parsedValue = parseInt(String(selectedValue), 10);

      return { gte: parsedValue, lte: parsedValue };
    }

    if (isTuple(selectedValue)) {
      const [gte, lte] = selectedValue as [string, string];

      return { gte: parseInt(gte, 10), lte: parseInt(lte, 10) };
    }

    return { gte: 0, lte: 0 };
  }
}
