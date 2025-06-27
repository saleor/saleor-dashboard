import { VoucherFilterInput } from "@dashboard/graphql";

import { FilterElement } from "../../FilterElement";
import { SpecialHandler } from "../types";

export class VoucherTimesUsedHandler implements SpecialHandler<VoucherFilterInput> {
  canHandle(element: FilterElement): boolean {
    return (
      element.value.type === "timesUsed" && typeof element.condition.selected.value === "string"
    );
  }

  handle(result: VoucherFilterInput, element: FilterElement): void {
    const value = Number(element.condition.selected.value);

    result.timesUsed = { gte: value, lte: value };
  }
}
