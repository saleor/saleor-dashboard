import { type IntFilterInput } from "@dashboard/graphql";

import { type Handler, NoopValuesHandler } from "../../API/Handler";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { type FilterElement } from "../../FilterElement/FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { type BothApiQueryVarsBuilder } from "./types";

type LegacyRange = { gte?: string; lte?: string };

/**
 * `numberOfOrders` has a different shape per API: `CustomerWhereInput` takes an
 * `IntFilterInput` (`eq` / `oneOf` / `range`), the deprecated `CustomerFilterInput`
 * takes an `IntRangeInput` (`gte` / `lte`).
 */
export class CustomerNumberOfOrdersQueryVarsBuilder
  implements
    BothApiQueryVarsBuilder<{
      numberOfOrders?: IntFilterInput | LegacyRange;
    }>
{
  canHandle(element: FilterElement): boolean {
    return element.value.value === "numberOfOrders";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQueryVariables(
    query: Readonly<{ numberOfOrders?: IntFilterInput }>,
    element: FilterElement,
  ): { numberOfOrders?: IntFilterInput } {
    const parsedValue = QueryVarsBuilderUtils.getIntegerValueFromElement(element);
    const conditionLabel = element.condition.selected.conditionValue?.label || "";
    const queryPart = QueryVarsBuilderUtils.buildNumericRangeCondition(parsedValue, conditionLabel);

    if (!queryPart) {
      return query;
    }

    return { ...query, numberOfOrders: queryPart as IntFilterInput };
  }

  updateFilterQueryVariables(
    query: Readonly<{ numberOfOrders?: LegacyRange }>,
    element: FilterElement,
  ): { numberOfOrders?: LegacyRange } {
    const { value: selectedValue } = element.condition.selected;
    const conditionLabel = element.condition.selected.conditionValue?.label;

    // Handle "between" condition (array of 2 values)
    if (Array.isArray(selectedValue) && selectedValue.length === 2) {
      const gte = isItemOption(selectedValue[0])
        ? selectedValue[0].value
        : String(selectedValue[0]);
      const lte = isItemOption(selectedValue[1])
        ? selectedValue[1].value
        : String(selectedValue[1]);

      return {
        ...query,
        numberOfOrders: { gte, lte },
      };
    }

    // Handle single value conditions: "is", "lower", "greater"
    const value = isItemOption(selectedValue) ? selectedValue.value : String(selectedValue);

    switch (conditionLabel) {
      case "is":
        return {
          ...query,
          numberOfOrders: { gte: value, lte: value },
        };
      case "lower":
        return {
          ...query,
          numberOfOrders: { lte: value },
        };
      case "greater":
        return {
          ...query,
          numberOfOrders: { gte: value },
        };
      default:
        return query;
    }
  }
}
