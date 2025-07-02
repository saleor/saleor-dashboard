import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { BothApiFilterDefinition } from "../types";

export class VoucherTimesUsedDefinition
  implements BothApiFilterDefinition<{ timesUsed?: { gte: number; lte: number } }>
{
  canHandle(element: FilterElement): boolean {
    return element.value.value === "timesUsed";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQuery(
    query: Readonly<{ timesUsed?: { gte: number; lte: number } }>,
    element: FilterElement,
  ): { timesUsed?: { gte: number; lte: number } } {
    const { value: selectedValue, conditionValue } = element.condition.selected;
    const conditionLabel = conditionValue?.label;

    if (Array.isArray(selectedValue) && selectedValue.length === 2) {
      const gte = isItemOption(selectedValue[0])
        ? parseInt(selectedValue[0].value, 10)
        : parseInt(String(selectedValue[0]), 10);
      const lte = isItemOption(selectedValue[1])
        ? parseInt(selectedValue[1].value, 10)
        : parseInt(String(selectedValue[1]), 10);

      return {
        ...query,
        timesUsed: { gte, lte },
      };
    }

    // Handle single value with "is" condition
    if (conditionLabel === "is") {
      const value = isItemOption(selectedValue)
        ? parseInt(selectedValue.value, 10)
        : parseInt(String(selectedValue), 10);

      return {
        ...query,
        timesUsed: { gte: value, lte: value },
      };
    }

    return query;
  }

  updateFilterQuery(
    query: Readonly<{ timesUsed?: { gte: number; lte: number } }>,
    element: FilterElement,
  ): { timesUsed?: { gte: number; lte: number } } {
    const whereQuery = this.updateWhereQuery(query, element);

    return {
      ...query,
      timesUsed: whereQuery.timesUsed,
    };
  }
}
