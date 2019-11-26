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
import { sortScores } from "./utils";

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
  )
    .map<QuickSearchActionInput>(category => ({
      caption: intl.formatMessage(messages.category),
      label: category.name,
      onClick: () => {
        navigate(categoryUrl(category.id));
        return false;
      },
      score: score(category.name, search),
      text: category.name,
      type: "catalog"
    }))
    .sort(sortScores);

  const collections: QuickSearchActionInput[] = maybe(
    () => catalog.collections.edges.map(edge => edge.node),
    []
  )
    .map<QuickSearchActionInput>(collection => ({
      caption: intl.formatMessage(messages.collection),
      extraInfo: intl.formatMessage(
        collection.isPublished
          ? messages.collectionPublished
          : messages.collectionUnpublished
      ),
      label: collection.name,
      onClick: () => {
        navigate(collectionUrl(collection.id));
        return false;
      },
      score: score(collection.name, search),
      text: collection.name,
      type: "catalog"
    }))
    .sort(sortScores);

  const products: QuickSearchActionInput[] = maybe(
    () => catalog.products.edges.map(edge => edge.node),
    []
  )
    .map<QuickSearchActionInput>(product => ({
      caption: intl.formatMessage(messages.product),
      extraInfo: product.category.name,
      label: product.name,
      onClick: () => {
        navigate(productUrl(product.id));
        return false;
      },
      score: score(product.name, search),
      text: product.name,
      type: "catalog"
    }))
    .sort(sortScores);

  const baseActions = [
    ...categories.slice(0, 1),
    ...collections.slice(0, 1),
    ...products.slice(0, 1)
  ];

  return [
    ...baseActions,
    ...[...categories.slice(1), ...collections.slice(1), ...products.slice(1)]
      .sort(sortScores)
      .slice(0, maxActions - baseActions.length)
  ].sort(sortScores);
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
