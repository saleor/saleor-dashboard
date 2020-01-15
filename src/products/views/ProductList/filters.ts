import { maybe, findValueInEnum } from "@saleor/misc";
import {
  ProductFilterKeys,
  ProductListFilterOpts,
  ProductStatus
} from "@saleor/products/components/ProductListPage";
import { UseSearchResult } from "@saleor/hooks/makeSearch";
import {
  SearchCategories,
  SearchCategoriesVariables
} from "@saleor/searches/types/SearchCategories";
import {
  InitialProductFilterData_categories_edges_node,
  InitialProductFilterData_collections_edges_node
} from "@saleor/products/types/InitialProductFilterData";
import {
  SearchCollections,
  SearchCollectionsVariables
} from "@saleor/searches/types/SearchCollections";
import { IFilterElement } from "../../../components/Filter";
import {
  ProductFilterInput,
  StockAvailability
} from "../../../types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils,
  getGteLteVariables,
  getMinMaxQueryParam,
  getSingleEnumValueQueryParam,
  dedupeFilter,
  getMultipleValueQueryParam
} from "../../../utils/filters";
import {
  ProductListUrlFilters,
  ProductListUrlFiltersEnum,
  ProductListUrlQueryParams,
  ProductListUrlFiltersWithMultipleValues
} from "../../urls";

export const PRODUCT_FILTERS_KEY = "productFilters";

export function getFilterOpts(
  params: ProductListUrlFilters,
  categories: {
    initial: InitialProductFilterData_categories_edges_node[];
    search: UseSearchResult<SearchCategories, SearchCategoriesVariables>;
  },
  collections: {
    initial: InitialProductFilterData_collections_edges_node[];
    search: UseSearchResult<SearchCollections, SearchCollectionsVariables>;
  }
): ProductListFilterOpts {
  return {
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
      displayValues: maybe(
        () =>
          categories.initial.map(category => ({
            label: category.name,
            value: category.id
          })),
        []
      ),
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
      displayValues: maybe(
        () =>
          collections.initial.map(category => ({
            label: category.name,
            value: category.id
          })),
        []
      ),
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
    status: {
      active: maybe(() => params.status !== undefined, false),
      value: maybe(() => findValueInEnum(params.status, ProductStatus))
    },
    stockStatus: {
      active: maybe(() => params.stockStatus !== undefined, false),
      value: maybe(() => findValueInEnum(params.stockStatus, StockAvailability))
    }
  };
}

export function getFilterVariables(
  params: ProductListUrlFilters
): ProductFilterInput {
  return {
    categories: params.categories !== undefined ? params.categories : null,
    collections: params.collections !== undefined ? params.collections : null,
    isPublished:
      params.status !== undefined
        ? params.status === ProductStatus.PUBLISHED
        : null,
    price: getGteLteVariables({
      gte: parseFloat(params.priceFrom),
      lte: parseFloat(params.priceTo)
    }),
    search: params.query,
    stockAvailability:
      params.stockStatus !== undefined
        ? findValueInEnum(params.stockStatus, StockAvailability)
        : null
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<ProductFilterKeys>
): ProductListUrlFilters {
  const { name } = filter;

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

    case ProductFilterKeys.status:
      return getSingleEnumValueQueryParam(
        filter,
        ProductListUrlFiltersEnum.status,
        ProductStatus
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
>(ProductListUrlFiltersEnum);
