import { FilterContainer, FilterElement } from "../FilterElement";
import { FilterQueryVarsBuilderResolver } from "./FilterQueryVarsBuilderResolver";
import {
  FilterQuery,
  QueryVarsBuilder,
  supportsFilterApi,
  supportsWhereApi,
} from "./queryVarsBuilders/types";
import { QueryApiType } from "./types";

interface QueryBuilderOptions<
  TQuery extends FilterQuery,
  TTopLevelKeys extends keyof TQuery = never,
> {
  apiType: QueryApiType;

  filterContainer: FilterContainer;

  topLevelKeys?: TTopLevelKeys[];

  filterDefinitionResolver?: FilterQueryVarsBuilderResolver<TQuery>;

  /** When true, wraps all root-level fields in an AND array to avoid mixing operators with field filters
   * e.g. {AND: [{metadata: {key: "...", ...}}], ids: ["a"]} -> {AND: [{metadata: ..., ids: ...}]}*/
  useAndWrapper?: boolean;
}

/** Builds query based on filters selected by user in Dashboard's UI
 * it can also extract variables to be used in top-level query, e.g. `channel`, which shouldn't be used in `where` input */
export class FiltersQueryBuilder<
  TQuery extends FilterQuery,
  TTopLevelKeys extends keyof TQuery = never,
> {
  private apiType: QueryApiType;

  private filterContainer: FilterContainer;

  private topLevelKeys: TTopLevelKeys[];

  private filterDefinitionResolver: FilterQueryVarsBuilderResolver<TQuery>;

  private useAndWrapper: boolean;

  constructor(options: QueryBuilderOptions<TQuery, TTopLevelKeys>) {
    this.apiType = options.apiType;
    this.filterContainer = options.filterContainer;
    this.topLevelKeys = options.topLevelKeys || [];
    this.useAndWrapper = options.useAndWrapper || false;
    this.filterDefinitionResolver =
      options.filterDefinitionResolver ||
      (FilterQueryVarsBuilderResolver.getDefaultResolver() as FilterQueryVarsBuilderResolver<TQuery>);
  }

  build(): { topLevel: Pick<TQuery, TTopLevelKeys>; filters: Omit<TQuery, TTopLevelKeys> } {
    let query = {} as TQuery;

    for (const element of this.getValidElements()) {
      const definition = this.filterDefinitionResolver.resolve(element);

      if (definition) {
        const updatedQuery = this.updateQueryWithDefinition(query, element, definition);

        query = updatedQuery;
      }
    }

    // Separate top-level keys from filters
    const topLevel: Pick<TQuery, TTopLevelKeys> = {} as Pick<TQuery, TTopLevelKeys>;
    let filters: Omit<TQuery, TTopLevelKeys> = { ...query };

    for (const key of this.topLevelKeys) {
      if (key in query) {
        topLevel[key] = query[key];
        delete (filters as Partial<TQuery>)[key];
      }
    }

    // Apply AND wrapper if configured
    if (this.useAndWrapper && Object.keys(filters).length > 0) {
      filters = this.wrapInAndArray(filters) as Omit<TQuery, TTopLevelKeys>;
    }

    return { topLevel, filters };
  }

  private wrapInAndArray(query: FilterQuery): FilterQuery {
    const andItems: Array<Record<string, unknown>> = [];

    if ("AND" in query && Array.isArray(query.AND)) {
      andItems.push(...query.AND);
    }

    // Convert all non-AND/OR root fields to AND array items
    for (const [key, value] of Object.entries(query)) {
      if (key !== "AND" && key !== "OR") {
        andItems.push({ [key]: value });
      }
    }

    if (andItems.length > 0) {
      return { AND: andItems, OR: query?.OR };
    }

    return { OR: query?.OR };
  }

  private updateQueryWithDefinition(
    query: TQuery,
    element: FilterElement,
    definition: QueryVarsBuilder<TQuery>,
  ): TQuery {
    const filterIdentifier = this.getFilterIdentifier(element);

    if (this.apiType === QueryApiType.WHERE) {
      if (!supportsWhereApi(definition)) {
        throw new Error(
          `Filter definition for element "${filterIdentifier}" does not support WHERE API.`,
        );
      }

      return definition.updateWhereQueryVariables(query, element);
    } else {
      if (!supportsFilterApi(definition)) {
        throw new Error(
          `Filter definition for element "${filterIdentifier}" does not support FILTER API.`,
        );
      }

      return definition.updateFilterQueryVariables(query, element);
    }
  }

  private getFilterIdentifier(element: FilterElement): string {
    if (element.isAttribute && element.selectedAttribute) {
      return `attribute.${element.selectedAttribute.value}`;
    }

    return element.value.value || element.value.type || "unknown";
  }

  private getValidElements(): FilterElement[] {
    return this.filterContainer.filter(
      (item): item is FilterElement =>
        typeof item !== "string" && !Array.isArray(item) && FilterElement.isFilterElement(item),
    );
  }
}
