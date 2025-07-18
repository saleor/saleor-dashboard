import { CollectionPublished } from "@dashboard/graphql";

import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { FilterOnlyQueryVarsBuilder } from "./types";

/** Collections don't use boolean values like other filters, we need to use enum */
export class CollectionPublishedQueryVarsBuilder
  implements FilterOnlyQueryVarsBuilder<{ published?: CollectionPublished }>
{
  canHandle(element: FilterElement): boolean {
    return element.value.value === "published";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateFilterQueryVariables(
    query: Readonly<{ published?: CollectionPublished }>,
    element: FilterElement,
  ): { published?: CollectionPublished } {
    const booleanValue = QueryVarsBuilderUtils.getBooleanValueFromElement(element);

    return {
      ...query,
      published: booleanValue ? CollectionPublished.PUBLISHED : CollectionPublished.HIDDEN,
    };
  }
}
