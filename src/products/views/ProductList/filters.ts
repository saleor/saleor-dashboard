import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import {
  InitialProductFilterAttributesQuery,
  InitialProductFilterCategoriesQuery,
  InitialProductFilterCollectionsQuery,
  InitialProductFilterProductTypesQuery,
  ProductFilterInput,
  SearchAttributeValuesQuery,
  SearchAttributeValuesQueryVariables,
  SearchCategoriesQuery,
  SearchCategoriesQueryVariables,
  SearchCollectionsQuery,
  SearchCollectionsQueryVariables,
  SearchProductTypesQuery,
  SearchProductTypesQueryVariables,
  StockAvailability,
} from "@saleor/graphql";
import { UseSearchResult } from "@saleor/hooks/makeSearch";
import { findValueInEnum, maybe } from "@saleor/misc";
import {
  ProductFilterKeys,
  ProductListFilterOpts,
} from "@saleor/products/components/ProductListPage";
import { RelayToFlat } from "@saleor/types";
import {
  mapEdgesToItems,
  mapNodeToChoice,
  mapSlugNodeToChoice,
} from "@saleor/utils/maps";
import moment from "moment-timezone";

import {
  FilterElement,
  FilterElementKeyValue,
  FilterElementRegular,
} from "../../../components/Filter";
import {
  createFilterTabUtils,
  createFilterUtils,
  dedupeFilter,
  getGteLteVariables,
  getKeyValueQueryParam,
  getMinMaxQueryParam,
  getMultipleValueQueryParam,
  getSingleEnumValueQueryParam,
  getSingleValueQueryParam,
  GteLte,
} from "../../../utils/filters";
import {
  ProductListUrlFilters,
  ProductListUrlFiltersAsDictWithMultipleValues,
  ProductListUrlFiltersEnum,
  ProductListUrlFiltersWithKeyValueValues,
  ProductListUrlFiltersWithMultipleValues,
  ProductListUrlQueryParams,
} from "../../urls";
import { getProductGiftCardFilterParam } from "./utils";
export const PRODUCT_FILTERS_KEY = "productFilters";

export function getFilterOpts(
  params: ProductListUrlFilters,
  attributes: RelayToFlat<InitialProductFilterAttributesQuery["attributes"]>,
  focusedAttributeChoices: UseSearchResult<
    SearchAttributeValuesQuery,
    SearchAttributeValuesQueryVariables
  >,
  categories: {
    initial: RelayToFlat<InitialProductFilterCategoriesQuery["categories"]>;
    search: UseSearchResult<
      SearchCategoriesQuery,
      SearchCategoriesQueryVariables
    >;
  },
  collections: {
    initial: RelayToFlat<InitialProductFilterCollectionsQuery["collections"]>;
    search: UseSearchResult<
      SearchCollectionsQuery,
      SearchCollectionsQueryVariables
    >;
  },
  productTypes: {
    initial: RelayToFlat<InitialProductFilterProductTypesQuery["productTypes"]>;
    search: UseSearchResult<
      SearchProductTypesQuery,
      SearchProductTypesQueryVariables
    >;
  },
  productKind: SingleAutocompleteChoiceType[],
  channels: SingleAutocompleteChoiceType[],
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
        value: dedupeFilter(params.attributes?.[attr.slug] || []),
      })),
    attributeChoices: {
      active: true,
      choices: mapSlugNodeToChoice(
        mapEdgesToItems(
          focusedAttributeChoices.result.data?.attribute?.choices,
        ),
      ),
      displayValues: mapNodeToChoice(
        mapEdgesToItems(
          focusedAttributeChoices.result.data?.attribute?.choices,
        ),
      ),
      hasMore:
        focusedAttributeChoices.result.data?.attribute?.choices?.pageInfo
          ?.hasNextPage || false,
      initialSearch: "",
      loading: focusedAttributeChoices.result.loading,
      onFetchMore: focusedAttributeChoices.loadMore,
      onSearchChange: focusedAttributeChoices.search,
      value: null,
    },
    categories: {
      active: !!params.categories,
      choices: mapNodeToChoice(
        mapEdgesToItems(categories?.search?.result?.data?.search),
      ),
      displayValues: !!params.categories
        ? maybe(
            () =>
              categories.initial.map(category => ({
                label: category.name,
                value: category.id,
              })),
            [],
          )
        : [],
      hasMore: maybe(
        () => categories.search.result.data.search.pageInfo.hasNextPage,
        false,
      ),
      initialSearch: "",
      loading: categories.search.result.loading,
      onFetchMore: categories.search.loadMore,
      onSearchChange: categories.search.search,
      value: dedupeFilter(params.categories || []),
    },
    channel: {
      active: params?.channel !== undefined,
      choices: channels,
      value: params?.channel,
    },
    collections: {
      active: !!params.collections,
      choices: mapNodeToChoice(
        mapEdgesToItems(collections?.search?.result?.data?.search),
      ),
      displayValues: !!params.collections
        ? maybe(
            () =>
              collections.initial.map(category => ({
                label: category.name,
                value: category.id,
              })),
            [],
          )
        : [],
      hasMore: maybe(
        () => collections.search.result.data.search.pageInfo.hasNextPage,
        false,
      ),
      initialSearch: "",
      loading: collections.search.result.loading,
      onFetchMore: collections.search.loadMore,
      onSearchChange: collections.search.search,
      value: dedupeFilter(params.collections || []),
    },
    metadata: {
      active: !!params?.metadata?.length,
      value: [
        ...(params?.metadata
          ? params.metadata.filter(pair => pair?.key !== undefined)
          : []),
      ],
    },
    productKind: {
      active: params?.productKind !== undefined,
      choices: productKind,
      value: params?.productKind,
    },
    price: {
      active: maybe(
        () =>
          [params.priceFrom, params.priceTo].some(field => field !== undefined),
        false,
      ),
      value: {
        max: maybe(() => params.priceTo, "0"),
        min: maybe(() => params.priceFrom, "0"),
      },
    },
    productType: {
      active: !!params.productTypes,
      choices: mapNodeToChoice(
        mapEdgesToItems(productTypes?.search?.result?.data?.search),
      ),
      displayValues: !!params.productTypes
        ? maybe(
            () =>
              productTypes.initial.map(productType => ({
                label: productType.name,
                value: productType.id,
              })),
            [],
          )
        : [],
      hasMore: maybe(
        () => productTypes.search.result.data.search.pageInfo.hasNextPage,
        false,
      ),
      initialSearch: "",
      loading: productTypes.search.result.loading,
      onFetchMore: productTypes.search.loadMore,
      onSearchChange: productTypes.search.search,
      value: dedupeFilter(params.productTypes || []),
    },
    stockStatus: {
      active: maybe(() => params.stockStatus !== undefined, false),
      value: maybe(() =>
        findValueInEnum(params.stockStatus, StockAvailability),
      ),
    },
  };
}

const parseFilterValue = (
  params: ProductListUrlFilters,
  key: string,
): {
  type: "boolean" | "date" | "dateTime" | "numeric" | "string";
  isMulti: boolean;
  value: string[];
} => {
  const value = params.attributes[key];
  const isMulti = params.attributes[key].length > 1;

  const isBooleanValue = value.every(val => val === "true" || val === "false");
  const isDateValue = (isMulti ? value : [value]).some(val =>
    moment(val, moment.HTML5_FMT.DATE, true).isValid(),
  );
  const isDateTimeValue = (isMulti ? value : [value]).some(val =>
    moment(val, moment.ISO_8601, true).isValid(),
  );
  const isNumericValue = value.some(value => !isNaN(parseFloat(value)));

  const data = { isMulti, value };

  if (isBooleanValue) {
    return { ...data, type: "boolean" };
  } else if (isDateValue) {
    return { ...data, type: "date" };
  } else if (isDateTimeValue) {
    return { ...data, type: "dateTime" };
  } else if (isNumericValue) {
    return { ...data, type: "numeric" };
  }
  return { ...data, type: "string" };
};

interface BaseFilterParam {
  slug: string;
}
interface BooleanFilterParam extends BaseFilterParam {
  boolean: boolean;
}
interface DateFilterParam extends BaseFilterParam {
  date: GteLte<string>;
}
interface DateTimeFilterParam extends BaseFilterParam {
  dateTime: GteLte<string>;
}
interface DefaultFilterParam extends BaseFilterParam {
  values: string[];
}

function getFilteredAttributeValue(
  params: ProductListUrlFilters,
): Array<
  | BooleanFilterParam
  | BaseFilterParam
  | DateTimeFilterParam
  | DateFilterParam
  | DefaultFilterParam
> {
  return !!params.attributes
    ? Object.keys(params.attributes).map(key => {
        const { isMulti, type, value } = parseFilterValue(params, key);
        const name = { slug: key };

        switch (type) {
          case "boolean":
            return { ...name, boolean: JSON.parse(value[0]) };

          case "date":
            return {
              ...name,
              date: getGteLteVariables({
                gte: value[0] || null,
                lte: isMulti ? value[1] || null : value[0],
              }),
            };

          case "dateTime":
            return {
              ...name,
              dateTime: getGteLteVariables({
                gte: value[0] || null,
                lte: isMulti ? value[1] || null : value[0],
              }),
            };

          case "numeric":
            return {
              ...name,
              valuesRange: {
                gte: value[0] || undefined,
                lte: isMulti ? value[1] || undefined : value[0] || undefined,
              },
            };

          default:
            return { ...name, values: value };
        }
      })
    : null;
}

export function getFilterVariables(
  params: ProductListUrlFilters,
  isChannelSelected: boolean,
): ProductFilterInput {
  return {
    attributes: getFilteredAttributeValue(params),
    categories: params.categories !== undefined ? params.categories : null,
    collections: params.collections !== undefined ? params.collections : null,
    metadata: params?.metadata,
    price: isChannelSelected
      ? getGteLteVariables({
          gte: parseFloat(params.priceFrom),
          lte: parseFloat(params.priceTo),
        })
      : null,
    productTypes:
      params.productTypes !== undefined ? params.productTypes : null,
    search: params.query,
    giftCard: getProductGiftCardFilterParam(params.productKind),
    stockAvailability:
      params.stockStatus !== undefined
        ? findValueInEnum(params.stockStatus, StockAvailability)
        : null,
  };
}

export function getFilterQueryParam(
  filter: FilterElement<ProductFilterKeys>,
  params: ProductListUrlFilters,
): ProductListUrlFilters {
  const { active, group, name, value } = filter;

  if (!!group) {
    const rest = params && params[group] ? params[group] : undefined;

    return {
      [group]: active
        ? {
            ...(rest === undefined ? {} : rest),
            [name]: value,
          }
        : rest,
    };
  }

  switch (name) {
    case ProductFilterKeys.categories:
      return getMultipleValueQueryParam(
        filter,
        ProductListUrlFiltersWithMultipleValues.categories,
      );

    case ProductFilterKeys.collections:
      return getMultipleValueQueryParam(
        filter,
        ProductListUrlFiltersWithMultipleValues.collections,
      );

    case ProductFilterKeys.price:
      return getMinMaxQueryParam(
        filter,
        ProductListUrlFiltersEnum.priceFrom,
        ProductListUrlFiltersEnum.priceTo,
      );

    case ProductFilterKeys.productType:
      return getMultipleValueQueryParam(
        filter,
        ProductListUrlFiltersWithMultipleValues.productTypes,
      );

    case ProductFilterKeys.stock:
      return getSingleEnumValueQueryParam(
        filter as FilterElementRegular<ProductFilterKeys.stock>,
        ProductListUrlFiltersEnum.stockStatus,
        StockAvailability,
      );

    case ProductFilterKeys.channel:
      return getSingleValueQueryParam(
        filter,
        ProductListUrlFiltersEnum.channel,
      );

    case ProductFilterKeys.productKind:
      return getSingleValueQueryParam(
        filter,
        ProductListUrlFiltersEnum.productKind,
      );

    case ProductFilterKeys.metadata:
      return getKeyValueQueryParam(
        filter as FilterElementKeyValue<ProductFilterKeys>,
        ProductListUrlFiltersWithKeyValueValues.metadata,
      );
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab,
} = createFilterTabUtils<ProductListUrlFilters>(PRODUCT_FILTERS_KEY);

export const {
  areFiltersApplied,
  getActiveFilters,
  getFiltersCurrentTab,
} = createFilterUtils<ProductListUrlQueryParams, ProductListUrlFilters>({
  ...ProductListUrlFiltersEnum,
  ...ProductListUrlFiltersWithMultipleValues,
  ...ProductListUrlFiltersAsDictWithMultipleValues,
});
