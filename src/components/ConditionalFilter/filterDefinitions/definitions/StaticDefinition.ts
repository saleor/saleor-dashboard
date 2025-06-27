import { ApolloClient } from "@apollo/client";

import {
  CategoryHandler,
  ChannelHandler,
  CollectionHandler,
  CustomerHandler,
  Handler,
  PageHandler,
  PageTypesHandler,
  ProductsHandler,
  ProductTypeHandler,
} from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray } from "../../FilterElement/ConditionValue";
import { mapStaticQueryPartToLegacyVariables } from "../../QueryBuilder/utils";
import { BothApiFilterDefinition } from "../types";

const SUPPORTED_STATIC_FIELDS = [
  "collection",
  "category",
  "productType",
  "channel",
  "product",
  "page",
  "pageType",
  "customer",
];

export class StaticDefinition implements BothApiFilterDefinition<any> {
  public canHandle(element: FilterElement): boolean {
    return element.isStatic() && SUPPORTED_STATIC_FIELDS.includes(element.value.value);
  }

  public createOptionFetcher(
    client: ApolloClient<unknown>,
    inputValue: string,
    element: FilterElement,
  ): Handler {
    switch (element.value.value) {
      case "collection":
        return new CollectionHandler(client, inputValue);
      case "category":
        return new CategoryHandler(client, inputValue);
      case "productType":
        return new ProductTypeHandler(client, inputValue);
      case "channel":
        return new ChannelHandler(client, inputValue);
      case "product":
        return new ProductsHandler(client, inputValue);
      case "page":
        return new PageHandler(client, inputValue);
      case "pageType":
        return new PageTypesHandler(client, inputValue);
      case "customer":
        return new CustomerHandler(client, inputValue);
      default:
        throw new Error(`Unknown static element: ${element.value.value}`);
    }
  }

  public updateWhereQuery(query: Readonly<any>, element: FilterElement): any {
    const { value: selectedValue } = element.condition.selected;
    const fieldName = element.value.value;
    let queryPart;

    if (isItemOption(selectedValue)) {
      queryPart = { eq: selectedValue.value };
    } else if (isItemOptionArray(selectedValue)) {
      queryPart = { oneOf: selectedValue.map(item => item.value) };
    } else {
      queryPart = { eq: selectedValue };
    }

    return { ...query, [fieldName]: queryPart };
  }

  public updateFilterQuery(query: Readonly<any>, element: FilterElement): any {
    const whereQuery = this.updateWhereQuery(query, element);
    const fieldName = element.value.value;

    return {
      ...query,
      [fieldName]: mapStaticQueryPartToLegacyVariables(whereQuery[fieldName]),
    };
  }
}
