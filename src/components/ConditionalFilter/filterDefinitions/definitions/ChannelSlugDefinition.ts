import { ApolloClient } from "@apollo/client";

import { ChannelHandler, Handler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray } from "../../FilterElement/ConditionValue";
import { BaseMappableDefinition } from "./BaseMappableDefinition";

/**
 * Specialized definition for channel filters that need to use the slug instead of the ID.
 * This is used specifically for Products, Vouchers, and Collections views where the
 * GraphQL API expects a channel slug in the top-level channel argument.
 */
export class ChannelSlugDefinition extends BaseMappableDefinition {
  protected readonly queryField = "channel";

  public canHandle(element: FilterElement): boolean {
    return element.isStatic() && element.value.value === "channel";
  }

  public createOptionFetcher(client: ApolloClient<unknown>, inputValue: string): Handler {
    return new ChannelHandler(client, inputValue);
  }

  protected getQueryFieldName(_element: FilterElement): string {
    return this.queryField;
  }

  protected getConditionValue(element: FilterElement, forWhere: boolean) {
    const { value: selectedValue } = element.condition.selected;

    if (isItemOption(selectedValue)) {
      const eq = selectedValue.slug;

      return forWhere ? { eq } : eq;
    }

    if (isItemOptionArray(selectedValue)) {
      const oneOf = selectedValue.map(item => item.slug);

      return forWhere ? { oneOf } : oneOf;
    }

    const eq = selectedValue;

    return forWhere ? { eq } : eq;
  }
}
