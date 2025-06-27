import { CollectionPublished } from "@dashboard/graphql";

import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { BothApiFilterDefinition } from "../types";

export class CollectionPublishedDefinition
  implements BothApiFilterDefinition<{ isPublished?: boolean | CollectionPublished }>
{
  canHandle(element: FilterElement): boolean {
    return element.value.value === "isPublished";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  private getBooleanValue(element: FilterElement) {
    const { value: selectedValue } = element.condition.selected;

    if (isItemOption(selectedValue)) {
      return selectedValue.value === "true";
    }

    if (typeof selectedValue === "boolean") {
      return selectedValue;
    }

    return String(selectedValue) === "true";
  }

  updateWhereQuery(
    query: Readonly<{ isPublished?: boolean }>,
    element: FilterElement,
  ): { isPublished?: boolean } {
    return { ...query, isPublished: this.getBooleanValue(element) };
  }

  updateFilterQuery(
    query: Readonly<{ isPublished?: CollectionPublished }>,
    element: FilterElement,
  ): { isPublished?: CollectionPublished } {
    const booleanValue = this.getBooleanValue(element);

    return {
      ...query,
      isPublished: booleanValue ? CollectionPublished.PUBLISHED : CollectionPublished.HIDDEN,
    };
  }
}
