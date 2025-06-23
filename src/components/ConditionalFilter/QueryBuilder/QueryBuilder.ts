import { AttributeInput } from "@dashboard/graphql";

import { FilterStrategyResolver } from "../API/strategies";
import { FilterContainer, FilterElement } from "../FilterElement";
import { QueryApiType, SpecialHandler, StaticQueryPart } from "./types";
import { mapStaticQueryPartToLegacyVariables } from "./utils";

export class QueryBuilder<T extends Record<string, any>> {
  constructor(
    private apiType: QueryApiType,
    private filterContainer: FilterContainer,
    private specialHandlers: SpecialHandler<T>[] = [],
    private resolver = FilterStrategyResolver.getResolver(),
  ) {}

  build(): T {
    const result = {} as T;
    const validElements = this.getValidElements();

    for (const element of validElements) {
      this.processElement(result, element);
    }

    return result;
  }

  private processElement(result: T, element: FilterElement): void {
    for (const handler of this.specialHandlers) {
      if (handler.canHandle(element)) {
        handler.handle(result, element, this.resolver);

        return;
      }
    }

    const strategy = this.resolver.resolve(element);
    const queryPart = strategy.buildQueryPart(element);

    this.handleField(result, element, queryPart);
  }

  private handleField(
    result: T,
    element: FilterElement,
    queryPart: StaticQueryPart | AttributeInput,
  ): void {
    const fieldName = element.value.value as keyof T;

    if (this.apiType === QueryApiType.WHERE) {
      result[fieldName] = queryPart as T[keyof T];
    } else {
      result[fieldName] = mapStaticQueryPartToLegacyVariables(queryPart) as T[keyof T];
    }
  }

  private getValidElements(): FilterElement[] {
    return this.filterContainer.filter(
      (item): item is FilterElement =>
        typeof item !== "string" && !Array.isArray(item) && FilterElement.isCompatible(item),
    );
  }
}
