import { AttributeInput, AttributeInputTypeEnum } from "@dashboard/graphql";

import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { BooleanValuesHandler, Handler } from "../Handler";
import { FilterHandlerStrategy } from "./types";

export class AttributeBooleanStrategy implements FilterHandlerStrategy {
  canHandle(filterElement: FilterElement): boolean {
    return filterElement.rowType() === "attribute" && filterElement.value.type === "BOOLEAN";
  }

  createHandler(): Handler {
    return new BooleanValuesHandler([
      {
        label: "Yes",
        value: "true",
        type: AttributeInputTypeEnum.BOOLEAN,
        slug: "true",
      },
      {
        label: "No",
        value: "false",
        type: AttributeInputTypeEnum.BOOLEAN,
        slug: "false",
      },
    ]);
  }

  buildQueryPart(filterElement: FilterElement): AttributeInput {
    const { value } = filterElement.condition.selected;

    return {
      slug: filterElement.value.value,
      boolean: isItemOption(value) ? value.value === "true" : value === "true",
    };
  }
}
