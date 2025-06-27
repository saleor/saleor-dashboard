import { ApolloClient } from "@apollo/client";
import { AttributeEntityTypeEnum, AttributeInput } from "@dashboard/graphql";

import {
  AttributeChoicesHandler,
  Handler,
  PageHandler,
  PageTypesHandler,
  ProductsHandler,
  ProductTypeHandler,
} from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { AttributeQueryBuilder } from "../helpers/AttributeQueryBuilder";
import { WhereOnlyFilterDefinition } from "../types";

export class AttributeDefinition
  implements WhereOnlyFilterDefinition<{ attributes?: AttributeInput[] }>
{
  public canHandle(element: FilterElement): boolean {
    return element.rowType() === "attribute";
  }

  public createOptionFetcher(
    client: ApolloClient<unknown>,
    inputValue: string,
    element: FilterElement,
  ): Handler {
    const { entityType, value: id } = element.selectedAttribute || element.value;

    switch (entityType) {
      case AttributeEntityTypeEnum.PAGE:
        return new PageHandler(client, inputValue);
      case AttributeEntityTypeEnum.PRODUCT:
        return new ProductsHandler(client, inputValue);
      case AttributeEntityTypeEnum.PRODUCT_VARIANT:
        return new ProductTypeHandler(client, inputValue);
      default:
        // Handle cases where entityType is null or other string values like "page-type"
        if (typeof entityType === "string" && entityType === "page-type") {
          return new PageTypesHandler(client, inputValue);
        }

        return new AttributeChoicesHandler(client, id, inputValue);
    }
  }

  public updateWhereQuery(
    query: Readonly<{ attributes?: AttributeInput[] }>,
    element: FilterElement,
  ): { attributes?: AttributeInput[] } {
    const attribute = AttributeQueryBuilder.build(element);

    if (!attribute.slug) {
      return query;
    }

    const existingAttributes = query.attributes || [];

    return {
      ...query,
      attributes: [...existingAttributes, attribute],
    };
  }
}
