import { GiftCardFilterInput } from "@dashboard/graphql";

import { FilterStrategyResolver } from "../../API/strategies";
import { FilterElement } from "../../FilterElement";
import { SpecialHandler } from "../types";
import { mapStaticQueryPartToLegacyVariables } from "../utils";

export class GiftCardStaticOnlyHandler implements SpecialHandler<GiftCardFilterInput> {
  canHandle(element: FilterElement): boolean {
    return element.isStatic();
  }

  handle(
    result: GiftCardFilterInput,
    element: FilterElement,
    resolver: FilterStrategyResolver,
  ): void {
    const fieldName = element.value.value as keyof GiftCardFilterInput;

    const strategy = resolver.resolve(element);
    const queryPart = strategy.buildQueryPart(element);

    (result as any)[fieldName] = mapStaticQueryPartToLegacyVariables(queryPart);
  }
}
