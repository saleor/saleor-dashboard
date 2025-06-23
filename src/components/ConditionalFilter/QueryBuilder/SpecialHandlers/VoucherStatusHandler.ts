import { VoucherFilterInput } from "@dashboard/graphql";

import { FilterStrategyResolver } from "../../API/strategies";
import { FilterElement } from "../../FilterElement";
import { SpecialHandler } from "../types";

export class VoucherStatusHandler implements SpecialHandler<VoucherFilterInput> {
  canHandle(element: FilterElement): boolean {
    return element.value.type === "voucherStatus";
  }

  handle(
    result: VoucherFilterInput,
    element: FilterElement,
    resolver: FilterStrategyResolver,
  ): void {
    const strategy = resolver.resolve(element);
    const queryPart = strategy.buildQueryPart(element);

    result.status = queryPart as any;
  }
}
