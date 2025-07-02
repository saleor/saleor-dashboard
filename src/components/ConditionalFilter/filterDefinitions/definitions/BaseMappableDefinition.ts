import { ApolloClient } from "@apollo/client";

import { Handler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { mapStaticQueryPartToLegacyVariables } from "../../QueryBuilder/utils";
import { BothApiFilterDefinition, FilterQuery } from "../types";
import { getConditionValue } from "../utils";

export abstract class BaseMappableDefinition implements BothApiFilterDefinition<FilterQuery> {
  public abstract canHandle(element: FilterElement): boolean;

  public abstract createOptionFetcher(
    client: ApolloClient<unknown>,
    inputValue: string,
    element: FilterElement,
  ): Handler;

  protected abstract getQueryFieldName(element: FilterElement): string;

  public updateWhereQuery(query: Readonly<FilterQuery>, element: FilterElement): FilterQuery {
    const fieldName = this.getQueryFieldName(element);
    const processedValue = getConditionValue(element, true);

    return { ...query, [fieldName]: processedValue };
  }

  public updateFilterQuery(query: Readonly<FilterQuery>, element: FilterElement): FilterQuery {
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
