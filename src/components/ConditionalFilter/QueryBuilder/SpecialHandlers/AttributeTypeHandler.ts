import { AttributeFilterInput } from "@dashboard/graphql";

import { FilterStrategyResolver } from "../../API/strategies";
import { FilterElement } from "../../FilterElement";
import { mapStaticQueryPartToLegacyVariables } from "../../queryVariables";
import { SpecialHandler } from "../types";

export class AttributeTypeHandler implements SpecialHandler<AttributeFilterInput> {
  canHandle(element: FilterElement): boolean {
    return element.value.type === "attributeType";
  }

  handle(
    result: AttributeFilterInput,
    element: FilterElement,
    resolver: FilterStrategyResolver,
  ): boolean {
    const strategy = resolver.resolve(element);
    const queryPart = strategy.buildQueryPart(element);

    result.type = mapStaticQueryPartToLegacyVariables(queryPart);

    return true;
  }
}
