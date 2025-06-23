import { MetadataFilter } from "@dashboard/graphql";

import { FilterElement } from "../../FilterElement";
import { SpecialHandler } from "../types";

export class MetadataHandler implements SpecialHandler<{ metadata?: MetadataFilter[] | null }> {
  canHandle(element: FilterElement): boolean {
    return element.value.type === "metadata";
  }

  handle(result: { metadata?: MetadataFilter[] | null }, element: FilterElement): void {
    if (!result.metadata) {
      result.metadata = [];
    }

    const [key, value] = element.condition.selected.value as [string, string];

    result.metadata.push({ key, value });
  }
}
