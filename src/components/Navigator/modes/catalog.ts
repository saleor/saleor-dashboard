import { score } from "fuzzaldrin";
import { IntlShape } from "react-intl";

import { categoryUrl } from "@saleor/categories/urls";
import { collectionUrl } from "@saleor/collections/urls";
import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import { maybe } from "@saleor/misc";
import { productUrl } from "@saleor/products/urls";
import { SearchCatalog } from "../queries/types/SearchCatalog";
import { QuickSearchAction, QuickSearchActionInput } from "../types";
import messages from "./messages";

const threshold = 0.05;
const maxActions = 5;

export function searchInCatalog(
  search: string,
  intl: IntlShape,
  navigate: UseNavigatorResult,
  catalog: SearchCatalog
): QuickSearchAction[] {
  const categories: QuickSearchActionInput[] = maybe(
    () => catalog.categories.edges.map(edge => edge.node),
    []
  ).map(category => ({
    caption: intl.formatMessage(messages.category),
    label: category.name,
    onClick: () => navigate(categoryUrl(category.id)),
    score: score(category.name, search),
    text: category.name,
    type: "catalog"
  }));

  const collections: QuickSearchActionInput[] = maybe(
    () => catalog.collections.edges.map(edge => edge.node),
    []
  ).map(collection => ({
    caption: intl.formatMessage(messages.collection),
    label: collection.name,
    onClick: () => navigate(collectionUrl(collection.id)),
    score: score(collection.name, search),
    text: collection.name,
    type: "catalog"
  }));

  const products: QuickSearchActionInput[] = maybe(
    () => catalog.products.edges.map(edge => edge.node),
    []
  ).map(product => ({
    caption: intl.formatMessage(messages.product),
    label: product.name,
    onClick: () => navigate(productUrl(product.id)),
    score: score(product.name, search),
    text: product.name,
    type: "catalog"
  }));

  return [...categories, ...collections, ...products];
}

function getCatalogModeActions(
  query: string,
  intl: IntlShape,
  navigate: UseNavigatorResult,
  catalog: SearchCatalog
): QuickSearchAction[] {
  return searchInCatalog(query, intl, navigate, catalog);
}

export default getCatalogModeActions;
