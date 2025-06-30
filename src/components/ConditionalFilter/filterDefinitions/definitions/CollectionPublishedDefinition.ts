import { CollectionPublished } from "@dashboard/graphql";

import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { FilterOnlyFilterDefinition } from "../types";
import { getBooleanValueFromElement } from "../utils";

export class CollectionPublishedDefinition
  implements FilterOnlyFilterDefinition<{ published?: CollectionPublished }>
{
  canHandle(element: FilterElement): boolean {
    return element.value.value === "published";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateFilterQuery(
    query: Readonly<{ published?: CollectionPublished }>,
    element: FilterElement,
  ): { published?: CollectionPublished } {
    const booleanValue = getBooleanValueFromElement(element);

    return {
      ...query,
      published: booleanValue ? CollectionPublished.PUBLISHED : CollectionPublished.HIDDEN,
    };
  }
}
