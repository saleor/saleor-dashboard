import { ApolloClient } from "@apollo/client";

import { Handler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { BothApiQueryVarsBuilder, FilterQuery } from "./types";

/** This class is used when we need a simple rename from FilterElement value
 * to different query variables
 * For example: attributeType -> type */
export abstract class BaseMappableQueryVarsBuilder<T extends FilterQuery = FilterQuery>
  implements BothApiQueryVarsBuilder<T>
{
  abstract canHandle(element: FilterElement): boolean;

  abstract createOptionFetcher(
    client: ApolloClient<unknown>,
    inputValue: string,
    element: FilterElement,
  ): Handler;

  protected abstract getQueryFieldName(element: FilterElement): string;

  protected getConditionValue(element: FilterElement): T[keyof T] | null {
    return QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element) as T[keyof T];
  }

  updateWhereQueryVariables(query: Readonly<T>, element: FilterElement): T {
    const fieldName = this.getQueryFieldName(element);
    const processedValue = this.getConditionValue(element);

    return { ...query, [fieldName]: processedValue };
  }

  updateFilterQueryVariables(query: Readonly<T>, element: FilterElement): T {
    const whereQuery = this.updateWhereQueryVariables(query, element);
    const fieldName = this.getQueryFieldName(element);
    const whereQueryPart = whereQuery[fieldName];

    return {
      ...query,
      [fieldName]: QueryVarsBuilderUtils.mapStaticQueryPartToLegacyVariables(
        whereQueryPart as { eq?: string; oneOf?: string[] },
      ),
    };
  }
}
