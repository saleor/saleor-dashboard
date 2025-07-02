import { DiscountStatusEnum, VoucherFilterInput } from "@dashboard/graphql";

import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray } from "../../FilterElement/ConditionValue";
import { FilterOnlyFilterDefinition } from "../types";

/** `voucherStatus` needs to be renamed to `status` in query - it's not supported in WHERE API */
export class VoucherStatusDefinition implements FilterOnlyFilterDefinition<VoucherFilterInput> {
  canHandle(element: FilterElement): boolean {
    return element.value.value === "voucherStatus";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateFilterQuery(
    query: Readonly<VoucherFilterInput>,
    element: FilterElement,
  ): VoucherFilterInput {
    const { value: selectedValue } = element.condition.selected;

    let status: DiscountStatusEnum[] | undefined;

    if (isItemOptionArray(selectedValue)) {
      status = selectedValue.map(item => item.value as DiscountStatusEnum);
    } else if (isItemOption(selectedValue)) {
      status = [selectedValue.value as DiscountStatusEnum];
    } else {
      status = undefined;
    }

    return {
      ...query,
      status,
    };
  }
}
