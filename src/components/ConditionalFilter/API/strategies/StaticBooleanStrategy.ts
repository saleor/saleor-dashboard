import { ApolloClient } from "@apollo/client";

import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { StaticQueryPart } from "../../queryVariables";
import { BooleanValuesHandler, Handler } from "../Handler";
import { FilterHandlerStrategy } from "./types";

export class StaticBooleanStrategy implements FilterHandlerStrategy {
  private static readonly BOOLEAN_TYPES = [
    "isAvailable",
    "isPublished",
    "isVisibleInListing",
    "hasCategory",
    "giftCard",
  ];

  canHandle(filterElement: FilterElement): boolean {
    const rowType = filterElement.rowType();

    return rowType ? StaticBooleanStrategy.BOOLEAN_TYPES.includes(rowType) : false;
  }

  createHandler(
    _client: ApolloClient<unknown>,
    _inputValue: string,
    filterElement: FilterElement,
  ): Handler {
    const rowType = filterElement.rowType()!;

    return new BooleanValuesHandler([
      { label: "Yes", value: "true", type: rowType, slug: "true" },
      { label: "No", value: "false", type: rowType, slug: "false" },
    ]);
  }

  buildQueryPart(filterElement: FilterElement): StaticQueryPart {
    const { value } = filterElement.condition.selected;

    return isItemOption(value) ? value.value === "true" : value === "true";
  }
}
