import { AttributeFilterInput } from "@dashboard/graphql";

import { FilterStrategyResolver } from "../../API/strategies";
import { FilterElement } from "../../FilterElement";
import { SpecialHandler } from "../types";
import { mapStaticQueryPartToLegacyVariables } from "../utils";

export class AttributeTypeHandler implements SpecialHandler<AttributeFilterInput> {
  canHandle(element: FilterElement): boolean {
    return element.value.type === "attributeType";
  }

  handle(
    result: AttributeFilterInput,
    element: FilterElement,
    resolver: FilterStrategyResolver,
  ): void {
    const strategy = resolver.resolve(element);
    const queryPart = strategy.buildQueryPart(element);

    result.type = mapStaticQueryPartToLegacyVariables(queryPart);
  }
}
