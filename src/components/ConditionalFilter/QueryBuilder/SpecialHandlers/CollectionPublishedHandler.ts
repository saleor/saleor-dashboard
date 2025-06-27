import { CollectionFilterInput, CollectionPublished } from "@dashboard/graphql";

import { FilterStrategyResolver } from "../../API/strategies";
import { FilterElement } from "../../FilterElement";
import { SpecialHandler } from "../types";
import { mapStaticQueryPartToLegacyVariables } from "../utils";

export class CollectionPublishedHandler implements SpecialHandler<CollectionFilterInput> {
  canHandle(element: FilterElement): boolean {
    return element.value.type === "published";
  }

  handle(
    result: CollectionFilterInput,
    element: FilterElement,
    resolver: FilterStrategyResolver,
  ): void {
    const strategy = resolver.resolve(element);
    const queryPart = strategy.buildQueryPart(element);
    const value = mapStaticQueryPartToLegacyVariables(queryPart);

    result.published = value === true ? CollectionPublished.PUBLISHED : CollectionPublished.HIDDEN;
  }
}
