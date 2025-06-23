import { StaffUserInput } from "@dashboard/graphql";

import { FilterStrategyResolver } from "../../API/strategies";
import { FilterElement } from "../../FilterElement";
import { SpecialHandler } from "../types";

export class StaffMemberStatusHandler implements SpecialHandler<StaffUserInput> {
  canHandle(element: FilterElement): boolean {
    return element.value.type === "staffMemberStatus";
  }

  handle(
    result: StaffUserInput,
    element: FilterElement,
    resolver: FilterStrategyResolver,
  ): boolean {
    const strategy = resolver.resolve(element);
    const queryPart = strategy.buildQueryPart(element);

    result.status = queryPart as any;
    // result.status = element.condition.selected;

    return true;
  }
}
