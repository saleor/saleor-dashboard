import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray } from "../../FilterElement/ConditionValue";
import { FilterQuery } from "../types";
import { BaseMappableDefinition } from "./BaseMappableDefinition";

export class VoucherChannelDefinition extends BaseMappableDefinition {
  protected readonly queryField = "channel";

  public canHandle(element: FilterElement): boolean {
    return element.value.value === "channel";
  }

  public createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(_element: FilterElement): string {
    return this.queryField;
  }

  public updateFilterQuery(query: Readonly<FilterQuery>, element: FilterElement): FilterQuery {
    const whereQuery = this.updateWhereQuery(query, element);

    return {
      ...query,
      // String values don't need legacy mapping for channel
      [this.queryField]: whereQuery[this.queryField],
    };
  }

  protected getConditionValue(element: FilterElement) {
    const { value: selectedValue } = element.condition.selected;

    if (isItemOption(selectedValue)) {
      const eq = selectedValue.slug;

      return { eq };
    }

    if (isItemOptionArray(selectedValue)) {
      const oneOf = selectedValue.map(item => item.slug);

      return { oneOf };
    }

    const eq = selectedValue;

    return { eq };
  }
}
