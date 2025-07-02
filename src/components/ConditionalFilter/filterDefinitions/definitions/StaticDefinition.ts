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
import { BothApiFilterDefinition, FilterQuery } from "../types";

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

type StaticWhereQueryPart = { eq: string } | { oneOf: string[] };

export class StaticDefinition implements BothApiFilterDefinition<FilterQuery> {
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

  public updateWhereQuery(query: Readonly<FilterQuery>, element: FilterElement): FilterQuery {
    const { value: selectedValue } = element.condition.selected;
    const fieldName = element.value.value;
    let queryPart: StaticWhereQueryPart | undefined;

    if (isItemOption(selectedValue)) {
      queryPart = { eq: selectedValue.value };
    } else if (isItemOptionArray(selectedValue)) {
      queryPart = { oneOf: selectedValue.map(item => item.value) };
    } else if (typeof selectedValue === "string") {
      queryPart = { eq: selectedValue };
    }

    return { ...query, [fieldName]: queryPart };
  }

  public updateFilterQuery(query: Readonly<FilterQuery>, element: FilterElement): FilterQuery {
    const whereQuery = this.updateWhereQuery(query, element);
    const fieldName = element.value.value;
    const whereQueryPart = whereQuery[fieldName] as StaticWhereQueryPart;

    if (!whereQueryPart) {
      return query;
    }

    return {
      ...query,
      [fieldName]: mapStaticQueryPartToLegacyVariables(
        whereQueryPart as { eq?: string; oneOf?: string[] },
      ),
    };
  }
}
