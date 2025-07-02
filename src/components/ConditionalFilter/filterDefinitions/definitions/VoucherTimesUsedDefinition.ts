import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isTuple } from "../../FilterElement/ConditionValue";
import { BaseMappableDefinition } from "./BaseMappableDefinition";

export class VoucherTimesUsedDefinition extends BaseMappableDefinition {
  protected readonly queryField = "timesUsed";

  public canHandle(element: FilterElement): boolean {
    return element.value.value === "timesUsed";
  }

  public createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(_element: FilterElement): string {
    return this.queryField;
  }

  protected getConditionValue(element: FilterElement, forWhere: boolean): unknown {
    const value = super.getConditionValue(element, forWhere) as any;

    if (value.range) {
      return {
        range: {
          gte: parseInt(value.range.gte, 10),
          lte: parseInt(value.range.lte, 10),
        },
      };
    }

    if (value.eq) {
      const parsedValue = parseInt(value.eq, 10);

      return {
        range: {
          gte: parsedValue,
          lte: parsedValue,
        },
      };
    }

    // Handle "is" condition for single value
    const { value: selectedValue, conditionValue } = element.condition.selected;

    if (conditionValue?.label === "is") {
      const parsedValue = parseInt(String(selectedValue), 10);

      return {
        range: {
          gte: parsedValue,
          lte: parsedValue,
        },
      };
    }

    if (isTuple(selectedValue)) {
      const [gte, lte] = selectedValue as [string, string];

      return {
        range: {
          gte: parseInt(gte, 10),
          lte: parseInt(lte, 10),
        },
      };
    }

    return value;
  }
}
