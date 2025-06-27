import { CustomerFilterInput } from "@dashboard/graphql";

import { FilterElement } from "../../FilterElement";
import { SpecialHandler } from "../types";

export class CustomerNumberOfOrdersHandler implements SpecialHandler<CustomerFilterInput> {
  canHandle(element: FilterElement): boolean {
    return (
      element.value.type === "numberOfOrders" &&
      element.condition.selected.conditionValue?.label === "is"
    );
  }

  handle(result: CustomerFilterInput, element: FilterElement): boolean {
    const value = Number(element.condition.selected.value);

    result.numberOfOrders = { gte: value, lte: value };

    return true;
  }
}
