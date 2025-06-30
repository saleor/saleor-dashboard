import { ApolloClient } from "@apollo/client";

import { Handler } from "../API/Handler";
import { FilterElement } from "../FilterElement";

export interface BaseFilterDefinition {
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

export interface WhereOnlyFilterDefinition<TQuery extends Record<string, any>>
  extends BaseFilterDefinition {
  /**
   * Processes a filter element and returns a new query object with the element's contribution for WHERE API.
   * This method MUST treat the input query as immutable and return a new one.
   */
  updateWhereQuery(query: Readonly<TQuery>, element: FilterElement): TQuery;
}

export interface FilterOnlyFilterDefinition<TQuery extends Record<string, any>>
  extends BaseFilterDefinition {
  /**
   * Processes a filter element and returns a new query object with the element's contribution for FILTER API.
   * This method MUST treat the input query as immutable and return a new one.
   */
  updateFilterQuery(query: Readonly<TQuery>, element: FilterElement): TQuery;
}

export interface BothApiFilterDefinition<TQuery extends Record<string, any>>
  extends BaseFilterDefinition {
  /**
   * Processes a filter element and returns a new query object with the element's contribution for WHERE API.
   * This method MUST treat the input query as immutable and return a new one.
   */
  updateWhereQuery(query: Readonly<TQuery>, element: FilterElement): TQuery;

  /**
   * Processes a filter element and returns a new query object with the element's contribution for FILTER API.
   * This method MUST treat the input query as immutable and return a new one.
   */
  updateFilterQuery(query: Readonly<TQuery>, element: FilterElement): TQuery;
}

/**
 * A discriminating union that ensures at least one of the update methods is implemented.
 */
export type FilterDefinition<TQuery extends Record<string, any>> =
  | WhereOnlyFilterDefinition<TQuery>
  | FilterOnlyFilterDefinition<TQuery>
  | BothApiFilterDefinition<TQuery>;

/**
 * Type guards to check which API methods are supported by a definition.
 */
export function supportsWhereApi<TQuery extends Record<string, any>>(
  definition: FilterDefinition<TQuery>,
): definition is WhereOnlyFilterDefinition<TQuery> | BothApiFilterDefinition<TQuery> {
  return "updateWhereQuery" in definition;
}

export function supportsFilterApi<TQuery extends Record<string, any>>(
  definition: FilterDefinition<TQuery>,
): definition is FilterOnlyFilterDefinition<TQuery> | BothApiFilterDefinition<TQuery> {
  return "updateFilterQuery" in definition;
}
