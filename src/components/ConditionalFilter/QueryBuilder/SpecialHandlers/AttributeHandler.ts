import { AttributeInput } from "@dashboard/graphql";

import { FilterStrategyResolver } from "../../API/strategies";
import { FilterElement } from "../../FilterElement";
import { SpecialHandler } from "../types";

export class AttributeHandler implements SpecialHandler<{ attributes?: AttributeInput[] | null }> {
  canHandle(element: FilterElement): boolean {
    return element.isAttribute;
  }

  handle(
    result: { attributes?: AttributeInput[] | null },
    element: FilterElement,
    resolver: FilterStrategyResolver,
  ): void {
    const strategy = resolver.resolve(element);
    const queryPart = strategy.buildQueryPart(element);

    if (!result.attributes) {
      result.attributes = [];
    }

    result.attributes.push(queryPart as AttributeInput);
  }
}
