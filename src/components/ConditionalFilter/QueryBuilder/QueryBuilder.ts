import { FilterDefinitionResolver } from "../filterDefinitions/FilterDefinitionResolver";
import { FilterDefinition, supportsFilterApi, supportsWhereApi } from "../filterDefinitions/types";
import { FilterContainer, FilterElement } from "../FilterElement";
import { QueryApiType } from "./types";

export class QueryBuilder<T extends Record<string, any>> {
  constructor(
    private apiType: QueryApiType,
    private filterContainer: FilterContainer,
    private filterDefinitionResolver: FilterDefinitionResolver = FilterDefinitionResolver.getDefaultResolver(),
  ) {}

  build(): T {
    let query = {} as T;

    for (const element of this.getValidElements()) {
      const definition = this.filterDefinitionResolver.resolve(element);

      if (definition) {
        const updatedQuery = this.updateQueryWithDefinition(query, element, definition);

        query = updatedQuery;
      }
    }

    return query;
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
          `Filter definition for element "${filterIdentifier}" does not support WHERE API. ` +
            `This definition only supports: ${supportsFilterApi(definition) ? "FILTER" : "none"} API.`,
        );
      }

      return definition.updateWhereQuery(query, element) as T;
    } else {
      if (!supportsFilterApi(definition)) {
        throw new Error(
          `Filter definition for element "${filterIdentifier}" does not support FILTER API. ` +
            `This definition only supports: ${supportsWhereApi(definition) ? "WHERE" : "none"} API.`,
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
