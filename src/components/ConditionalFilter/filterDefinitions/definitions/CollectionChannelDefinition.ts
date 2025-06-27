import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { mapStaticQueryPartToLegacyVariables } from "../../QueryBuilder/utils";
import { BothApiFilterDefinition } from "../types";

export class CollectionChannelDefinition
  implements BothApiFilterDefinition<{ channel?: { eq: string } }>
{
  canHandle(element: FilterElement): boolean {
    // This is specific to the Collections filter context
    return element.value.value === "channel";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQuery(
    query: Readonly<{ channel?: { eq: string } }>,
    element: FilterElement,
  ): { channel?: { eq: string } } {
    const { value: selectedValue } = element.condition.selected;
    let channelValue: string;

    if (isItemOption(selectedValue)) {
      channelValue = selectedValue.slug;
    } else {
      channelValue = String(selectedValue);
    }

    return { ...query, channel: { eq: channelValue } };
  }

  updateFilterQuery(
    query: Readonly<{ channel?: { eq: string } }>,
    element: FilterElement,
  ): { channel?: { eq: string } } {
    const whereQuery = this.updateWhereQuery(query, element);

    return {
      ...query,
      channel: whereQuery.channel
        ? mapStaticQueryPartToLegacyVariables(whereQuery.channel)
        : undefined,
    };
  }
}
