import { ApolloClient } from "@apollo/client";

import {
  CategoryHandler,
  ChannelHandler,
  CollectionHandler,
  CustomerHandler,
  Handler,
  PageTypesHandler,
  ProductsHandler,
  ProductTypeHandler,
} from "../../API/Handler";
import { STATIC_CONDITIONS } from "../../constants";
import { FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray } from "../../FilterElement/ConditionValue";
import { QueryVarsBuilderUtils } from "../utils";
import { BothApiQueryVarsBuilder, FilterQuery } from "./types";

const SUPPORTED_STATIC_FIELDS = new Set([
  "collection",
  "category",
  "productType",
  "channel",
  "products",
  "pageTypes",
  "customer",
] satisfies Array<keyof typeof STATIC_CONDITIONS>);

type SupportedStaticFieldsKeys = typeof SUPPORTED_STATIC_FIELDS extends Set<infer T> ? T : never;

type StaticWhereQueryPart = { eq?: string } | { oneOf?: string[] };

/** Static definitions provide a list of chosable elements based on entity type (e.g. category)
 * and return a list of selected entity IDs
 *
 * These are actually not static, we fetch dynamically list from API, but we left name "static"
 * to be consistent with other parts of Dashboard */
export class StaticQueryVarsBuilder implements BothApiQueryVarsBuilder<StaticWhereQueryPart> {
  canHandle(element: FilterElement): boolean {
    return SUPPORTED_STATIC_FIELDS.has(element.value.type as SupportedStaticFieldsKeys);
  }

  createOptionFetcher(
    client: ApolloClient<unknown>,
    inputValue: string,
    element: FilterElement,
  ): Handler {
    switch (element.value.type as keyof typeof STATIC_CONDITIONS) {
      case "collection":
        return new CollectionHandler(client, inputValue);
      case "category":
        return new CategoryHandler(client, inputValue);
      case "productType":
        return new ProductTypeHandler(client, inputValue);
      case "channel":
        return new ChannelHandler(client, inputValue);
      case "products":
        return new ProductsHandler(client, inputValue);
      case "pageTypes":
        return new PageTypesHandler(client, inputValue);
      case "customer":
        return new CustomerHandler(client, inputValue);
      default:
        throw new Error(`Unknown static element: ${element.value.value}`);
    }
  }

  updateWhereQueryVariables(query: Readonly<FilterQuery>, element: FilterElement) {
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

  updateFilterQueryVariables(query: Readonly<FilterQuery>, element: FilterElement) {
    const whereQuery = this.updateWhereQueryVariables(query, element);
    const fieldName = element.value.value;
    const whereQueryPart = whereQuery[fieldName] as StaticWhereQueryPart;

    if (!whereQueryPart) {
      return query;
    }

    return {
      ...query,
      [fieldName]: QueryVarsBuilderUtils.mapStaticQueryPartToLegacyVariables(
        whereQueryPart as { eq?: string; oneOf?: string[] },
      ),
    };
  }
}
