import { ApolloClient } from "@apollo/client";

import { ChannelHandler, Handler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray } from "../../FilterElement/ConditionValue";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

/** This query vars builder for `channel` is using slug instead of value (which is base64 ID)
 * for inputs that require this format */
export class SlugChannelQueryVarsBuilder extends BaseMappableQueryVarsBuilder {
  protected readonly queryField = "channel";

  canHandle(element: FilterElement): boolean {
    return element.value.value === "channel";
  }

  createOptionFetcher(client: ApolloClient<unknown>, inputValue: string): Handler {
    return new ChannelHandler(client, inputValue);
  }

  protected getQueryFieldName(_element: FilterElement): string {
    return this.queryField;
  }

  // Use `item.slug` instead of `item.value`
  protected getConditionValue(element: FilterElement): string | string[] {
    const { value: selectedValue } = element.condition.selected;

    if (isItemOption(selectedValue)) {
      return selectedValue.slug;
    }

    if (isItemOptionArray(selectedValue)) {
      return selectedValue.map(item => item.slug);
    }

    return selectedValue;
  }
}
