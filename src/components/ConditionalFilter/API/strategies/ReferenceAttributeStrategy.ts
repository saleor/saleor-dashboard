import { ApolloClient } from "@apollo/client";
import { AttributeInput } from "@dashboard/graphql";

import { FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray } from "../../FilterElement/ConditionValue";
import { Handler, PageHandler, ProductsHandler, ProductVariantHandler } from "../Handler";
import { FilterHandlerStrategy } from "./types";

export class ReferenceAttributeStrategy implements FilterHandlerStrategy {
  canHandle(filterElement: FilterElement): boolean {
    return (
      filterElement.rowType() === "attribute" &&
      filterElement.selectedAttribute?.type === "REFERENCE"
    );
  }

  createHandler(
    client: ApolloClient<unknown>,
    inputValue: string,
    filterElement: FilterElement,
  ): Handler {
    const entityType = filterElement.selectedAttribute?.entityType;

    switch (entityType) {
      case "PAGE":
        return new PageHandler(client, inputValue);
      case "PRODUCT":
        return new ProductsHandler(client, inputValue);
      case "PRODUCT_VARIANT":
        return new ProductVariantHandler(client, inputValue);
      default:
        throw new Error(`Unsupported reference entity type: ${entityType}`);
    }
  }

  buildQueryPart(filterElement: FilterElement): AttributeInput {
    const { value } = filterElement.condition.selected;
    const attributeSlug = filterElement.selectedAttribute!.value;

    if (isItemOption(value)) {
      return { slug: attributeSlug, valueNames: [value.label] };
    }

    if (isItemOptionArray(value)) {
      return { slug: attributeSlug, valueNames: value.map(item => item.label) };
    }

    return { slug: attributeSlug };
  }
}
