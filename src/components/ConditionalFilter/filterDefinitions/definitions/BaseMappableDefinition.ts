import { ApolloClient } from "@apollo/client";

import { Handler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { mapStaticQueryPartToLegacyVariables } from "../../QueryBuilder/utils";
import { BothApiFilterDefinition, FilterQuery } from "../types";
import { getConditionValue } from "../utils";

export abstract class BaseMappableDefinition<T extends FilterQuery = FilterQuery>
  implements BothApiFilterDefinition<T>
{
  public abstract canHandle(element: FilterElement): boolean;

  public abstract createOptionFetcher(
    client: ApolloClient<unknown>,
    inputValue: string,
    element: FilterElement,
  ): Handler;

  protected abstract getQueryFieldName(element: FilterElement): string;

  protected getConditionValue(element: FilterElement): T[keyof T] {
    return getConditionValue(element, true) as T[keyof T];
  }

  public updateWhereQuery(query: Readonly<T>, element: FilterElement): T {
    const fieldName = this.getQueryFieldName(element);
    const processedValue = this.getConditionValue(element);

    return { ...query, [fieldName]: processedValue };
  }

  public updateFilterQuery(query: Readonly<T>, element: FilterElement): T {
    const whereQuery = this.updateWhereQuery(query, element);
    const fieldName = this.getQueryFieldName(element);
    const whereQueryPart = whereQuery[fieldName];

    return {
      ...query,
      [fieldName]: mapStaticQueryPartToLegacyVariables(
        whereQueryPart as { eq?: string; oneOf?: string[] },
      ),
    };
  }
}
