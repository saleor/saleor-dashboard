import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { BothApiFilterDefinition } from "../types";

export class VoucherChannelDefinition implements BothApiFilterDefinition<{ channel?: string }> {
  canHandle(element: FilterElement): boolean {
    return element.value.value === "channel";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQuery(
    query: Readonly<{ channel?: string }>,
    element: FilterElement,
  ): { channel?: string } {
    const { value: selectedValue } = element.condition.selected;
    let channelValue: string;

    if (isItemOption(selectedValue)) {
      channelValue = selectedValue.slug;
    } else {
      channelValue = String(selectedValue);
    }

    return { ...query, channel: channelValue };
  }

  updateFilterQuery(
    query: Readonly<{ channel?: string }>,
    element: FilterElement,
  ): { channel?: string } {
    const whereQuery = this.updateWhereQuery(query, element);

    return {
      ...query,
      channel: whereQuery.channel, // String values don't need legacy mapping for channel
    };
  }
}
