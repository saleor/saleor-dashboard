import {
  FilterQuery,
  QueryVarsBuilder,
  supportsFilterApi,
  supportsWhereApi,
} from "@dashboard/components/ConditionalFilter/QueryFiltersBuilder/queryVarsBuilders/types";

import { FilterContainer, FilterElement } from "../FilterElement";
import { FilterQueryVarsBuilderResolver } from "./FilterQueryVarsBuilderResolver";
import { QueryApiType } from "./types";

export class QueryBuilder<TQuery extends FilterQuery, TTopLevelKeys extends keyof TQuery = never> {
  constructor(
    private apiType: QueryApiType,
    private filterContainer: FilterContainer,
    private topLevelKeys: TTopLevelKeys[] = [],
    private filterDefinitionResolver: FilterQueryVarsBuilderResolver<TQuery> = FilterQueryVarsBuilderResolver.getDefaultResolver(),
  ) { }

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
    const filters: Omit<TQuery, TTopLevelKeys> = { ...query };

    for (const key of this.topLevelKeys) {
      if (key in query) {
        topLevel[key] = query[key];
        delete (filters as Partial<TQuery>)[key];
      }
    }

    return { topLevel, filters };
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

      return definition.updateWhereQuery(query, element);
    } else {
      if (!supportsFilterApi(definition)) {
        throw new Error(
          `Filter definition for element "${filterIdentifier}" does not support FILTER API.`,
        );
      }

      return definition.updateFilterQuery(query, element);
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
        typeof item !== "string" && !Array.isArray(item) && FilterElement.isCompatible(item),
    );
  }
}
