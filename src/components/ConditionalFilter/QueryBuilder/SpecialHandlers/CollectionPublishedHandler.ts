import { CollectionFilterInput, CollectionPublished } from "@dashboard/graphql";

import { FilterStrategyResolver } from "../../API/strategies";
import { FilterElement } from "../../FilterElement";
import { SpecialHandler } from "../types";

export class CollectionPublishedHandler implements SpecialHandler<CollectionFilterInput> {
  canHandle(element: FilterElement): boolean {
    return element.value.type === "published";
  }

  handle(
    result: CollectionFilterInput,
    element: FilterElement,
    resolver: FilterStrategyResolver,
  ): boolean {
    const strategy = resolver.resolve(element);
    const queryPart = strategy.buildQueryPart(element);

    result.published =
      queryPart === true ? CollectionPublished.PUBLISHED : CollectionPublished.HIDDEN;

    return true;
  }
}
