// @ts-strict-ignore
import { categoryUrl } from "@dashboard/categories/urls";
import { collectionUrl } from "@dashboard/collections/urls";
import { SearchCatalogQuery } from "@dashboard/graphql";
import { UseNavigatorResult } from "@dashboard/hooks/useNavigator";
import { fuzzySearch } from "@dashboard/misc";
import { productUrl, productVariantEditUrl } from "@dashboard/products/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { IntlShape } from "react-intl";

import { QuickSearchAction, QuickSearchActionInput } from "../types";
import { getProductVariantLabel } from "./labels";
import messages from "./messages";

export function searchInCatalog(
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
    searchValue: category.name,
    onClick: () => {
      navigate(categoryUrl(category.id));

      return false;
    },
    text: category.name,
    type: "catalog",
    thumbnail: category.backgroundImage,
    extraInfo: category.level === 0 ? intl.formatMessage(messages.root) : undefined,
  }));
  const collections: QuickSearchActionInput[] = (
    mapEdgesToItems(catalog?.collections) || []
  ).map<QuickSearchActionInput>(collection => ({
    caption: intl.formatMessage(messages.collection),
    label: collection.name,
    searchValue: collection.name,
    onClick: () => {
      navigate(collectionUrl(collection.id));

      return false;
    },
    text: collection.name,
    type: "catalog",
    thumbnail: collection.backgroundImage,
  }));
  const products: QuickSearchActionInput[] = (
    mapEdgesToItems(catalog?.products) || []
  ).map<QuickSearchActionInput>(product => ({
    caption: intl.formatMessage(messages.product),
    extraInfo: product.category.name,
    label: product.name,
    searchValue: product.name,
    onClick: () => {
      navigate(productUrl(product.id));

      return false;
    },
    text: product.name,
    type: "catalog",
    thumbnail: product.thumbnail,
  }));
  const variants: QuickSearchActionInput[] = (
    mapEdgesToItems(catalog?.productVariants) || []
  ).map<QuickSearchActionInput>(variant => ({
    caption: intl.formatMessage(messages.variant),
    extraInfo: variant.product.category.name,
    label: getProductVariantLabel(variant),
    searchValue: `${variant.product.name} ${variant.name} ${variant.sku}`,
    onClick: () => {
      navigate(productVariantEditUrl(variant.product.id, variant.id));

      return false;
    },
    text: variant.name,
    type: "catalog",
    thumbnail: variant.product.thumbnail,
  }));

  const searchableItems = [...categories, ...collections, ...products, ...variants];
  const searchResults = fuzzySearch(searchableItems, search, ["searchValue"], 0.8);

  return searchResults;
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
