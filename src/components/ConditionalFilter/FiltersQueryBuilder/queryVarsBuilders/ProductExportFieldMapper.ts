import { ApolloClient } from "@apollo/client";
import * as Sentry from "@sentry/react";

import { CategoryHandler, CollectionHandler, Handler, ProductTypeHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { FilterOnlyQueryVarsBuilder } from "./types";

type ProductExportFieldQueryPart = {
  collections?: string[];
  categories?: string[];
  productTypes?: string[];
};

/**
 * FILTER API-only mapper for product export operations.
 *
 * Maps singular UI field names to plural GraphQL field names:
 * - collection → collections
 * - category → categories
 * - productType → productTypes
 *
 * ProductFilterInput requires arrays for these fields per GraphQL schema.
 * This mapper transforms filter values into the required array format.
 */
export class ProductExportFieldMapper
  implements FilterOnlyQueryVarsBuilder<ProductExportFieldQueryPart>
{
  private static readonly FIELD_MAP: Record<string, keyof ProductExportFieldQueryPart> = {
    collection: "collections",
    category: "categories",
    productType: "productTypes",
  };

  canHandle(element: FilterElement): boolean {
    return element.value.type in ProductExportFieldMapper.FIELD_MAP;
  }

  createOptionFetcher(
    client: ApolloClient<unknown>,
    inputValue: string,
    element: FilterElement,
  ): Handler {
    switch (element.value.type) {
      case "collection":
        return new CollectionHandler(client, inputValue);
      case "category":
        return new CategoryHandler(client, inputValue);
      case "productType":
        return new ProductTypeHandler(client, inputValue);
      default:
        throw new Error(`Unknown field type for product export mapper: ${element.value.type}`);
    }
  }

  protected getQueryFieldName(element: FilterElement): string {
    const mappedField = ProductExportFieldMapper.FIELD_MAP[element.value.type];

    if (!mappedField) {
      const error = new Error(
        `Field ${element.value.type} cannot be mapped to ProductFilterInput. Expected one of: ${Object.keys(ProductExportFieldMapper.FIELD_MAP).join(", ")}`,
      );

      Sentry.captureException(error);
      throw error;
    }

    return mappedField;
  }

  updateFilterQueryVariables(
    query: Readonly<ProductExportFieldQueryPart>,
    element: FilterElement,
  ): ProductExportFieldQueryPart {
    const fieldName = this.getQueryFieldName(element) as keyof ProductExportFieldQueryPart;
    const value = QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element);

    let filterValue: string[];

    if (typeof value === "object" && value !== null) {
      if ("eq" in value && value.eq) {
        filterValue = [value.eq as string];
      } else if ("oneOf" in value && value.oneOf) {
        filterValue = value.oneOf as string[];
      } else {
        filterValue = value as string[];
      }
    } else {
      filterValue = Array.isArray(value) ? value : [value as string];
    }

    return {
      ...query,
      [fieldName]: filterValue,
    };
  }
}
