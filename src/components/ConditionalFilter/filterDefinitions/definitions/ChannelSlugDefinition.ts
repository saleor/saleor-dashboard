import { ApolloClient } from "@apollo/client";

import { ChannelHandler, Handler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray } from "../../FilterElement/ConditionValue";
import { mapStaticQueryPartToLegacyVariables } from "../../QueryBuilder/utils";
import { BothApiFilterDefinition } from "../types";

/**
 * Specialized definition for channel filters that need to use the slug instead of the ID.
 * This is used specifically for Products, Vouchers, and Collections views where the
 * GraphQL API expects a channel slug in the top-level channel argument.
 */
export class ChannelSlugDefinition implements BothApiFilterDefinition<any> {
  public canHandle(element: FilterElement): boolean {
    return element.isStatic() && element.value.value === "channel";
  }

  public createOptionFetcher(client: ApolloClient<unknown>, inputValue: string): Handler {
    return new ChannelHandler(client, inputValue);
  }

  public updateWhereQuery(query: Readonly<any>, element: FilterElement): any {
    const { value: selectedValue } = element.condition.selected;
    let queryPart;

    if (isItemOption(selectedValue)) {
      queryPart = { eq: selectedValue.slug };
    } else if (isItemOptionArray(selectedValue)) {
      queryPart = { oneOf: selectedValue.map(item => item.slug) };
    } else {
      queryPart = { eq: selectedValue };
    }

    return { ...query, channel: queryPart };
  }

  public updateFilterQuery(query: Readonly<any>, element: FilterElement): any {
    const whereQuery = this.updateWhereQuery(query, element);

    return {
      ...query,
      channel: mapStaticQueryPartToLegacyVariables(whereQuery.channel),
    };
  }
}
