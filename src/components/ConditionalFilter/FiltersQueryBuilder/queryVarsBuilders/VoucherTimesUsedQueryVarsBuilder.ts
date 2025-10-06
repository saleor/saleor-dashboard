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
    const conditionLabel = conditionValue?.label;

    // Handle "between" condition (array of 2 values)
    if (isTuple(selectedValue)) {
      const [gte, lte] = selectedValue as [string, string];

      return { gte: parseInt(gte, 10), lte: parseInt(lte, 10) };
    }

    // Handle single value conditions: "is", "lower", "greater"
    const parsedValue = parseInt(String(selectedValue), 10);

    switch (conditionLabel) {
      case "is":
        return { gte: parsedValue, lte: parsedValue };
      case "lower":
        return { lte: parsedValue };
      case "greater":
        return { gte: parsedValue };
      default:
        return {};
    }
  }
}
