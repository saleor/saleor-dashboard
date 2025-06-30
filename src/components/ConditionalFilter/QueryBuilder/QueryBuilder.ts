import { FilterDefinitionResolver } from "../filterDefinitions/FilterDefinitionResolver";
import { FilterDefinition, supportsFilterApi, supportsWhereApi } from "../filterDefinitions/types";
import { FilterContainer, FilterElement } from "../FilterElement";
import { QueryApiType } from "./types";

export class QueryBuilder<T extends Record<string, any>, K extends keyof T = never> {
  constructor(
    private apiType: QueryApiType,
    private filterContainer: FilterContainer,
    private topLevelKeys: K[] = [],
    private filterDefinitionResolver: FilterDefinitionResolver = FilterDefinitionResolver.getDefaultResolver(),
  ) {}

  build(): { topLevel: Pick<T, K>; filters: Omit<T, K> } {
    let query = {} as T;

    for (const element of this.getValidElements()) {
      const definition = this.filterDefinitionResolver.resolve(element);

      if (definition) {
        const updatedQuery = this.updateQueryWithDefinition(query, element, definition);

        query = updatedQuery;
      }
    }

    // Separate top-level keys from filters
    const topLevel: Pick<T, K> = {} as Pick<T, K>;
    const filters: Omit<T, K> = { ...query };

    for (const key of this.topLevelKeys) {
      if (key in query) {
        topLevel[key] = query[key];
        delete (filters as Partial<T>)[key];
      }
    }

    return { topLevel, filters };
  }

  private updateQueryWithDefinition(
    query: T,
    element: FilterElement,
    definition: FilterDefinition<T>,
  ): T {
    const filterIdentifier = this.getFilterIdentifier(element);

    if (this.apiType === QueryApiType.WHERE) {
      if (!supportsWhereApi(definition)) {
        throw new Error(
          `Filter definition for element "${filterIdentifier}" does not support WHERE API.`,
        );
      }

      return definition.updateWhereQuery(query, element) as T;
    } else {
      if (!supportsFilterApi(definition)) {
        throw new Error(
          `Filter definition for element "${filterIdentifier}" does not support FILTER API.`,
        );
      }

      return definition.updateFilterQuery(query, element) as T;
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
