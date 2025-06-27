import { ApolloClient } from "@apollo/client";
import { AttributeInput } from "@dashboard/graphql";

import { FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray, isTuple } from "../../FilterElement/ConditionValue";
import { AttributeChoicesHandler, Handler } from "../Handler";
import { FilterHandlerStrategy } from ".";

export class StandardAttributeStrategy implements FilterHandlerStrategy {
  canHandle(filterElement: FilterElement): boolean {
    return (
      filterElement.rowType() === "attribute" &&
      filterElement.selectedAttribute?.type !== "BOOLEAN" &&
      filterElement.selectedAttribute?.type !== "REFERENCE"
    );
  }

  createHandler(
    client: ApolloClient<unknown>,
    inputValue: string,
    filterElement: FilterElement,
  ): Handler {
    const attributeSlug = filterElement.selectedAttribute!.value;

    return new AttributeChoicesHandler(client, attributeSlug, inputValue);
  }

  buildQueryPart(filterElement: FilterElement): AttributeInput {
    const { value } = filterElement.condition.selected;
    const attributeSlug = filterElement.selectedAttribute!.value;

    if (isItemOption(value)) {
      return { slug: attributeSlug, values: [value.value] };
    }

    if (isItemOptionArray(value)) {
      return { slug: attributeSlug, values: value.map(item => item.value) };
    }

    if (isTuple(value)) {
      const [gte, lte] = value;

      return {
        slug: attributeSlug,
        valuesRange: {
          gte: parseFloat(gte),
          lte: parseFloat(lte),
        },
      };
    }

    return { slug: attributeSlug };
  }
}
