import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { UseSearchResult } from "@saleor/hooks/makeSearch";
import { findValueInEnum, maybe } from "@saleor/misc";
import {
  ProductFilterKeys,
  ProductListFilterOpts
} from "@saleor/products/components/ProductListPage";
import { InitialProductFilterAttributes_attributes_edges_node } from "@saleor/products/types/InitialProductFilterAttributes";
import { InitialProductFilterCategories_categories_edges_node } from "@saleor/products/types/InitialProductFilterCategories";
import { InitialProductFilterCollections_collections_edges_node } from "@saleor/products/types/InitialProductFilterCollections";
import { InitialProductFilterProductTypes_productTypes_edges_node } from "@saleor/products/types/InitialProductFilterProductTypes";
import {
  SearchAttributeValues,
  SearchAttributeValuesVariables
} from "@saleor/searches/types/SearchAttributeValues";
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
import {
  mapEdgesToItems,
  mapNodeToChoice,
  mapSlugNodeToChoice
} from "@saleor/utils/maps";
import isArray from "lodash/isArray";

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
  getSingleEnumValueQueryParam,
  getSingleValueQueryParam
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
  attributes: InitialProductFilterAttributes_attributes_edges_node[],
  focusedAttributeChoices: UseSearchResult<
    SearchAttributeValues,
    SearchAttributeValuesVariables
  >,
  categories: {
    initial: InitialProductFilterCategories_categories_edges_node[];
    search: UseSearchResult<SearchCategories, SearchCategoriesVariables>;
  },
  collections: {
    initial: InitialProductFilterCollections_collections_edges_node[];
    search: UseSearchResult<SearchCollections, SearchCollectionsVariables>;
  },
  productTypes: {
    initial: InitialProductFilterProductTypes_productTypes_edges_node[];
    search: UseSearchResult<SearchProductTypes, SearchProductTypesVariables>;
  },
  channels: SingleAutocompleteChoiceType[]
): ProductListFilterOpts {
  return {
    attributes: attributes
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map(attr => ({
        active: maybe(() => params.attributes[attr.slug].length > 0, false),
        id: attr.id,
        name: attr.name,
        slug: attr.slug,
        inputType: attr.inputType,
        value:
          !!params.attributes && params.attributes[attr.slug]
            ? dedupeFilter(params.attributes[attr.slug])
            : []
      })),
    attributeChoices: {
      active: true,
      choices: mapSlugNodeToChoice(
        mapEdgesToItems(focusedAttributeChoices.result.data?.attribute?.choices)
      ),
      displayValues: mapNodeToChoice(
        mapEdgesToItems(focusedAttributeChoices.result.data?.attribute?.choices)
      ),
      hasMore:
        focusedAttributeChoices.result.data?.attribute?.choices?.pageInfo
          ?.hasNextPage || false,
      initialSearch: "",
      loading: focusedAttributeChoices.result.loading,
      onFetchMore: focusedAttributeChoices.loadMore,
      onSearchChange: focusedAttributeChoices.search,
      value: null
    },
    categories: {
      active: !!params.categories,
      choices: mapNodeToChoice(
        mapEdgesToItems(categories?.search?.result?.data?.search)
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
    channel: {
      active: params?.channel !== undefined,
      choices: channels,
      value: params?.channel
    },
    collections: {
      active: !!params.collections,
      choices: mapNodeToChoice(
        mapEdgesToItems(collections?.search?.result?.data?.search)
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
      choices: mapNodeToChoice(
        mapEdgesToItems(productTypes?.search?.result?.data?.search)
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

function getFilteredAttributeValue(
  params: ProductListUrlFilters
): Array<({ boolean: boolean } | { values: string[] }) & { slug: string }> {
  return !!params.attributes
    ? Object.keys(params.attributes).map(key => {
        const value = params.attributes[key];
        const isMulti = isArray(params.attributes[key]);
        const isBooleanValue =
          !isMulti && ["true", "false"].includes((value as unknown) as string);

        return {
          slug: key,
          ...(isBooleanValue
            ? { boolean: JSON.parse((value as unknown) as string) }
            : {
                // It is possible for qs to parse values not as string[] but string
                values: isMulti ? value : (([value] as unknown) as string[])
              })
        };
      })
    : null;
}

export function getFilterVariables(
  params: ProductListUrlFilters,
  isChannelSelected: boolean
): ProductFilterInput {
  return {
    attributes: getFilteredAttributeValue(params),
    categories: params.categories !== undefined ? params.categories : null,
    collections: params.collections !== undefined ? params.collections : null,
    price: isChannelSelected
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

    case ProductFilterKeys.channel:
      return getSingleValueQueryParam(
        filter,
        ProductListUrlFiltersEnum.channel
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
