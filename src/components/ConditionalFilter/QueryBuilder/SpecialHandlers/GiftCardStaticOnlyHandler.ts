import { GiftCardFilterInput } from "@dashboard/graphql";

import { FilterStrategyResolver } from "../../API/strategies";
import { FilterElement } from "../../FilterElement";
import { SpecialHandler } from "../types";

export class GiftCardStaticOnlyHandler implements SpecialHandler<GiftCardFilterInput> {
  canHandle(element: FilterElement): boolean {
    return element.isStatic();
  }

  handle(
    result: GiftCardFilterInput,
    element: FilterElement,
    resolver: FilterStrategyResolver,
  ): boolean {
    const strategy = resolver.resolve(element);
    const queryPart = strategy.buildQueryPart(element);
    const fieldName = element.value.value as keyof GiftCardFilterInput;

    // TODO fix any
    (result as any)[fieldName] = queryPart;

    return true;
  }
}
