import { VoucherFilterInput } from "@dashboard/graphql";

import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { SpecialHandler } from "../types";

export class VoucherChannelHandler implements SpecialHandler<VoucherFilterInput> {
  private channelValue: string | undefined;

  canHandle(element: FilterElement): boolean {
    return element.value.type === "channel";
  }

  handle(_: VoucherFilterInput, element: FilterElement): void {
    this.channelValue = isItemOption(element.condition.selected.value)
      ? element.condition.selected.value.slug
      : (element.condition.selected.value as string);
  }

  getChannel(): string | undefined {
    return this.channelValue;
  }
}
