import { UseSearchResult } from "@saleor/hooks/makeSearch";
import { findValueInEnum, maybe } from "@saleor/misc";
import {
  ProductFilterKeys,
  ProductListFilterOpts
} from "@saleor/products/components/ProductListPage";
import {
  InitialProductFilterData_attributes_edges_node,
  InitialProductFilterData_categories_edges_node,
  InitialProductFilterData_collections_edges_node,
  InitialProductFilterData_productTypes_edges_node
} from "@saleor/products/types/InitialProductFilterData";
import {
  SearchCategories,
  SearchCategoriesVariables
} from "@saleor/searches/types/SearchCategories";
import {
  SearchCollections,
  SearchCollectionsVariables
} from "@saleor/searches/types/SearchCollections";
import {
  SearchProductTypes,
  SearchProductTypesVariables
} from "@saleor/searches/types/SearchProductTypes";
import isArray from "lodash-es/isArray";

import { IFilterElement } from "../../../components/Filter";
import {
  ProductFilterInput,
  StockAvailability
} from "../../../types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils,
  dedupeFilter,
  getGteLteVariables,
  getMinMaxQueryParam,
  getMultipleValueQueryParam,
  getSingleEnumValueQueryParam
} from "../../../utils/filters";
import {
  ProductListUrlFilters,
  ProductListUrlFiltersAsDictWithMultipleValues,
  ProductListUrlFiltersEnum,
  ProductListUrlFiltersWithMultipleValues,
  ProductListUrlQueryParams
} from "../../urls";

export const PRODUCT_FILTERS_KEY = "productFilters";

export function getFilterOpts(
  params: ProductListUrlFilters,
  attributes: InitialProductFilterData_attributes_edges_node[],
  categories: {
    initial: InitialProductFilterData_categories_edges_node[];
    search: UseSearchResult<SearchCategories, SearchCategoriesVariables>;
  },
  collections: {
    initial: InitialProductFilterData_collections_edges_node[];
    search: UseSearchResult<SearchCollections, SearchCollectionsVariables>;
  },
  productTypes: {
    initial: InitialProductFilterData_productTypes_edges_node[];
    search: UseSearchResult<SearchProductTypes, SearchProductTypesVariables>;
  }
): ProductListFilterOpts {
  return {
    attributes: attributes
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map(attr => ({
        active: maybe(() => params.attributes[attr.slug].length > 0, false),
        choices: attr.values.map(val => ({
          label: val.name,
          value: val.slug
        })),
        name: attr.name,
        slug: attr.slug,
        value:
          !!params.attributes && params.attributes[attr.slug]
            ? params.attributes[attr.slug]
            : []
      })),
    categories: {
      active: !!params.categories,
      choices: maybe(
        () =>
          categories.search.result.data.search.edges.map(edge => ({
            label: edge.node.name,
            value: edge.node.id
          })),
        []
      ),
      displayValues: !!params.categories
        ? maybe(
            () =>
              categories.initial.map(category => ({
                label: category.name,
                value: category.id
              })),
            []
          )
        : [],
      hasMore: maybe(
        () => categories.search.result.data.search.pageInfo.hasNextPage,
        false
      ),
      initialSearch: "",
      loading: categories.search.result.loading,
      onFetchMore: categories.search.loadMore,
      onSearchChange: categories.search.search,
      value: maybe(() => dedupeFilter(params.categories), [])
    },
    collections: {
      active: !!params.collections,
      choices: maybe(
        () =>
          collections.search.result.data.search.edges.map(edge => ({
            label: edge.node.name,
            value: edge.node.id
          })),
        []
      ),
      displayValues: !!params.collections
        ? maybe(
            () =>
              collections.initial.map(category => ({
                label: category.name,
                value: category.id
              })),
            []
          )
        : [],
      hasMore: maybe(
        () => collections.search.result.data.search.pageInfo.hasNextPage,
        false
      ),
      initialSearch: "",
      loading: collections.search.result.loading,
      onFetchMore: collections.search.loadMore,
      onSearchChange: collections.search.search,
      value: maybe(() => dedupeFilter(params.collections), [])
    },
    price: {
      active: maybe(
        () =>
          [params.priceFrom, params.priceTo].some(field => field !== undefined),
        false
      ),
      value: {
        max: maybe(() => params.priceTo, "0"),
        min: maybe(() => params.priceFrom, "0")
      }
    },
    productType: {
      active: !!params.productTypes,
      choices: maybe(
        () =>
          productTypes.search.result.data.search.edges.map(edge => ({
            label: edge.node.name,
            value: edge.node.id
          })),
        []
      ),
      displayValues: !!params.productTypes
        ? maybe(
            () =>
              productTypes.initial.map(productType => ({
                label: productType.name,
                value: productType.id
              })),
            []
          )
        : [],
      hasMore: maybe(
        () => productTypes.search.result.data.search.pageInfo.hasNextPage,
        false
      ),
      initialSearch: "",
      loading: productTypes.search.result.loading,
      onFetchMore: productTypes.search.loadMore,
      onSearchChange: productTypes.search.search,
      value: maybe(() => dedupeFilter(params.productTypes), [])
    },
    stockStatus: {
      active: maybe(() => params.stockStatus !== undefined, false),
      value: maybe(() => findValueInEnum(params.stockStatus, StockAvailability))
    }
  };
}

export function getFilterVariables(
  params: ProductListUrlFilters,
  channel: string | undefined
): ProductFilterInput {
  return {
    attributes: !!params.attributes
      ? Object.keys(params.attributes).map(key => ({
          slug: key,
          // It is possible for qs to parse values not as string[] but string
          values: isArray(params.attributes[key])
            ? params.attributes[key]
            : (([params.attributes[key]] as unknown) as string[])
        }))
      : null,
    categories: params.categories !== undefined ? params.categories : null,
    channel: channel || null,
    collections: params.collections !== undefined ? params.collections : null,
    price: channel
      ? getGteLteVariables({
          gte: parseFloat(params.priceFrom),
          lte: parseFloat(params.priceTo)
        })
      : null,
    productTypes:
      params.productTypes !== undefined ? params.productTypes : null,
    search: params.query,
    stockAvailability:
      params.stockStatus !== undefined
        ? findValueInEnum(params.stockStatus, StockAvailability)
        : null
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<ProductFilterKeys>,
  params: ProductListUrlFilters
): ProductListUrlFilters {
  const { active, group, name, value } = filter;

  if (!!group) {
    const rest = params && params[group] ? params[group] : undefined;

    return {
      [group]: active
        ? {
            ...(rest === undefined ? {} : rest),
            [name]: value
          }
        : rest
    };
  }

  switch (name) {
    case ProductFilterKeys.categories:
      return getMultipleValueQueryParam(
        filter,
        ProductListUrlFiltersWithMultipleValues.categories
      );

    case ProductFilterKeys.collections:
      return getMultipleValueQueryParam(
        filter,
        ProductListUrlFiltersWithMultipleValues.collections
      );

    case ProductFilterKeys.price:
      return getMinMaxQueryParam(
        filter,
        ProductListUrlFiltersEnum.priceFrom,
        ProductListUrlFiltersEnum.priceTo
      );

    case ProductFilterKeys.productType:
      return getMultipleValueQueryParam(
        filter,
        ProductListUrlFiltersWithMultipleValues.productTypes
      );

    case ProductFilterKeys.stock:
      return getSingleEnumValueQueryParam(
        filter,
        ProductListUrlFiltersEnum.stockStatus,
        StockAvailability
      );
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<ProductListUrlFilters>(PRODUCT_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  ProductListUrlQueryParams,
  ProductListUrlFilters
>({
  ...ProductListUrlFiltersEnum,
  ...ProductListUrlFiltersWithMultipleValues,
  ...ProductListUrlFiltersAsDictWithMultipleValues
});
