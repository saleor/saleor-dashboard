import { ApolloClient } from "@apollo/client";

import { Handler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";

export type FilterQuery = Record<string, unknown>;

interface BaseQueryVarsBuilder {
  /**
   * Determines if this definition should handle the given filter element.
   */
  canHandle(element: FilterElement): boolean;

  /**
   * Creates a handler responsible for fetching options for the filter's value.
   */
  createOptionFetcher(
    client: ApolloClient<unknown>,
    inputValue: string,
    filterElement: FilterElement,
  ): Handler;
}

export interface WhereOnlyQueryVarsBuilder<TQuery extends FilterQuery>
  extends BaseQueryVarsBuilder {
  /**
   * Processes a filter element and returns a new query object with the element's contribution for WHERE API.
   * This method MUST treat the input query as immutable and return a new one.
   */
  updateWhereQueryVariables(query: Readonly<TQuery>, element: FilterElement): TQuery;
}

export interface FilterOnlyQueryVarsBuilder<TQuery extends FilterQuery>
  extends BaseQueryVarsBuilder {
  /**
   * Processes a filter element and returns a new query object with the element's contribution for FILTER API.
   * This method MUST treat the input query as immutable and return a new one.
   */
  updateFilterQueryVariables(query: Readonly<TQuery>, element: FilterElement): TQuery;
}

export type BothApiQueryVarsBuilder<TQuery extends FilterQuery> =
  WhereOnlyQueryVarsBuilder<TQuery> & FilterOnlyQueryVarsBuilder<TQuery>;

/**
 * A discriminating union that ensures at least one of the update methods is implemented.
 */
export type QueryVarsBuilder<TQuery extends FilterQuery> =
  | WhereOnlyQueryVarsBuilder<TQuery>
  | FilterOnlyQueryVarsBuilder<TQuery>
  | BothApiQueryVarsBuilder<TQuery>;

/**
 * Type guards to check which API methods are supported by a definition.
 */
export function supportsWhereApi<TQuery extends FilterQuery>(
  definition: QueryVarsBuilder<TQuery>,
): definition is WhereOnlyQueryVarsBuilder<TQuery> | BothApiQueryVarsBuilder<TQuery> {
  return "updateWhereQueryVariables" in definition;
}

export function supportsFilterApi<TQuery extends FilterQuery>(
  definition: QueryVarsBuilder<TQuery>,
): definition is FilterOnlyQueryVarsBuilder<TQuery> | BothApiQueryVarsBuilder<TQuery> {
  return "updateFilterQueryVariables" in definition;
}
