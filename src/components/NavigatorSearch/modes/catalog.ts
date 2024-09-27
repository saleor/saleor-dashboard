// @ts-strict-ignore
import { categoryUrl } from "@dashboard/categories/urls";
import { collectionUrl } from "@dashboard/collections/urls";
import { SearchCatalogQuery } from "@dashboard/graphql";
import { UseNavigatorResult } from "@dashboard/hooks/useNavigator";
import { fuzzySearch } from "@dashboard/misc";
import { productUrl } from "@dashboard/products/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { IntlShape } from "react-intl";

import { QuickSearchAction, QuickSearchActionInput } from "../types";
import messages from "./messages";

function searchInCatalog(
  search: string,
  intl: IntlShape,
  navigate: UseNavigatorResult,
  catalog: SearchCatalogQuery,
): QuickSearchAction[] {
  const categories: QuickSearchActionInput[] = (
    mapEdgesToItems(catalog?.categories) || []
  ).map<QuickSearchActionInput>(category => ({
    caption: intl.formatMessage(messages.category),
    label: category.name,
    onClick: () => {
      navigate(categoryUrl(category.id));

      return false;
    },
    text: category.name,
    type: "catalog",
  }));
  const collections: QuickSearchActionInput[] = (
    mapEdgesToItems(catalog?.collections) || []
  ).map<QuickSearchActionInput>(collection => ({
    caption: intl.formatMessage(messages.collection),
    label: collection.name,
    onClick: () => {
      navigate(collectionUrl(collection.id));

      return false;
    },
    text: collection.name,
    type: "catalog",
  }));
  const products: QuickSearchActionInput[] = (
    mapEdgesToItems(catalog?.products) || []
  ).map<QuickSearchActionInput>(product => ({
    caption: intl.formatMessage(messages.product),
    extraInfo: product.category.name,
    label: product.name,
    onClick: () => {
      navigate(productUrl(product.id));

      return false;
    },
    text: product.name,
    type: "catalog",
  }));

  const searchableItems = [...categories, ...collections, ...products];

  return fuzzySearch(searchableItems, search, ["label"]);
}

function getCatalogModeActions(
  query: string,
  intl: IntlShape,
  navigate: UseNavigatorResult,
  catalog: SearchCatalogQuery,
): QuickSearchAction[] {
  return searchInCatalog(query, intl, navigate, catalog);
}

export default getCatalogModeActions;
