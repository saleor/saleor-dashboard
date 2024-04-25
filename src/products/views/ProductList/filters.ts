// @ts-strict-ignore
import { FilterContainer } from "@dashboard/components/ConditionalFilter/FilterElement";
import { createProductQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { SingleAutocompleteChoiceType } from "@dashboard/components/SingleAutocompleteSelectField";
import { FlagValue } from "@dashboard/featureFlags/FlagContent";
import {
  AttributeFragment,
  AttributeInputTypeEnum,
  InitialProductFilterAttributesQuery,
  InitialProductFilterCategoriesQuery,
  InitialProductFilterCollectionsQuery,
  InitialProductFilterProductTypesQuery,
  ProductFilterInput,
  ProductWhereInput,
  SearchAttributeValuesQuery,
  SearchAttributeValuesQueryVariables,
  SearchCategoriesQuery,
  SearchCategoriesQueryVariables,
  SearchCollectionsQuery,
  SearchCollectionsQueryVariables,
  SearchProductTypesQuery,
  SearchProductTypesQueryVariables,
  StockAvailability,
} from "@dashboard/graphql";
import { UseSearchResult } from "@dashboard/hooks/makeSearch";
import { findValueInEnum, maybe } from "@dashboard/misc";
import {
  ProductFilterKeys,
  ProductListFilterOpts,
} from "@dashboard/products/components/ProductListPage";
import { RelayToFlat } from "@dashboard/types";
import { mapEdgesToItems, mapNodeToChoice, mapSlugNodeToChoice } from "@dashboard/utils/maps";

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

export const PRODUCT_FILTERS_KEY = "productPresets";

function getAttributeFilterParamType(inputType: AttributeInputTypeEnum) {
  switch (inputType) {
    case AttributeInputTypeEnum.DATE:
      return ProductListUrlFiltersAsDictWithMultipleValues.dateAttributes;
    case AttributeInputTypeEnum.DATE_TIME:
      return ProductListUrlFiltersAsDictWithMultipleValues.dateTimeAttributes;
    case AttributeInputTypeEnum.NUMERIC:
      return ProductListUrlFiltersAsDictWithMultipleValues.numericAttributes;
    case AttributeInputTypeEnum.BOOLEAN:
      return ProductListUrlFiltersAsDictWithMultipleValues.booleanAttributes;
    default:
      return ProductListUrlFiltersAsDictWithMultipleValues.stringAttributes;
  }
}

export function getAttributeValuesFromParams(
  params: ProductListUrlFilters,
  attribute: Pick<AttributeFragment, "inputType" | "slug">,
) {
  return params[getAttributeFilterParamType(attribute.inputType)]?.[attribute.slug] || [];
}

export function mapAttributeParamsToFilterOpts(
  attributes: RelayToFlat<InitialProductFilterAttributesQuery["attributes"]>,
  params: ProductListUrlFilters,
) {
  return attributes
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .map(attr => {
      const attrValues = getAttributeValuesFromParams(params, attr);

      return {
        active: attrValues.length > 0,
        id: attr.id,
        name: attr.name,
        slug: attr.slug,
        inputType: attr.inputType,
        value: dedupeFilter(attrValues),
      };
    });
}

export function getFilterOpts(
  params: ProductListUrlFilters,
  attributes: RelayToFlat<InitialProductFilterAttributesQuery["attributes"]>,
  focusedAttributeChoices: UseSearchResult<
    SearchAttributeValuesQuery,
    SearchAttributeValuesQueryVariables
  >,
  categories: {
    initial: RelayToFlat<InitialProductFilterCategoriesQuery["categories"]>;
    search: UseSearchResult<SearchCategoriesQuery, SearchCategoriesQueryVariables>;
  },
  collections: {
    initial: RelayToFlat<InitialProductFilterCollectionsQuery["collections"]>;
    search: UseSearchResult<SearchCollectionsQuery, SearchCollectionsQueryVariables>;
  },
  productTypes: {
    initial: RelayToFlat<InitialProductFilterProductTypesQuery["productTypes"]>;
    search: UseSearchResult<SearchProductTypesQuery, SearchProductTypesQueryVariables>;
  },
  productKind: SingleAutocompleteChoiceType[],
  channels: SingleAutocompleteChoiceType[],
): ProductListFilterOpts {
  return {
    attributes: mapAttributeParamsToFilterOpts(attributes, params),
    attributeChoices: {
      active: true,
      choices: mapSlugNodeToChoice(
        mapEdgesToItems(focusedAttributeChoices.result.data?.attribute?.choices),
      ),
      displayValues: mapNodeToChoice(
        mapEdgesToItems(focusedAttributeChoices.result.data?.attribute?.choices),
      ),
      hasMore:
        focusedAttributeChoices.result.data?.attribute?.choices?.pageInfo?.hasNextPage || false,
      initialSearch: "",
      loading: focusedAttributeChoices.result.loading,
      onFetchMore: focusedAttributeChoices.loadMore,
      onSearchChange: focusedAttributeChoices.search,
      value: null,
    },
    categories: {
      active: !!params.categories,
      choices: mapNodeToChoice(mapEdgesToItems(categories?.search?.result?.data?.search)),
      displayValues: params.categories
        ? maybe(
            () =>
              categories.initial.map(category => ({
                label: category.name,
                value: category.id,
              })),
            [],
          )
        : [],
      hasMore: maybe(() => categories.search.result.data.search.pageInfo.hasNextPage, false),
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
      choices: mapNodeToChoice(mapEdgesToItems(collections?.search?.result?.data?.search)),
      displayValues: params.collections
        ? maybe(
            () =>
              collections.initial.map(category => ({
                label: category.name,
                value: category.id,
              })),
            [],
          )
        : [],
      hasMore: maybe(() => collections.search.result.data.search.pageInfo.hasNextPage, false),
      initialSearch: "",
      loading: collections.search.result.loading,
      onFetchMore: collections.search.loadMore,
      onSearchChange: collections.search.search,
      value: dedupeFilter(params.collections || []),
    },
    metadata: {
      active: !!params?.metadata?.length,
      value: [...(params?.metadata ? params.metadata.filter(pair => pair?.key !== undefined) : [])],
    },
    productKind: {
      active: params?.productKind !== undefined,
      choices: productKind,
      value: params?.productKind,
    },
    price: {
      active: maybe(
        () => [params.priceFrom, params.priceTo].some(field => field !== undefined),
        false,
      ),
      value: {
        max: maybe(() => params.priceTo, "0"),
        min: maybe(() => params.priceFrom, "0"),
      },
    },
    productType: {
      active: !!params.productTypes,
      choices: mapNodeToChoice(mapEdgesToItems(productTypes?.search?.result?.data?.search)),
      displayValues: params.productTypes
        ? maybe(
            () =>
              productTypes.initial.map(productType => ({
                label: productType.name,
                value: productType.id,
              })),
            [],
          )
        : [],
      hasMore: maybe(() => productTypes.search.result.data.search.pageInfo.hasNextPage, false),
      initialSearch: "",
      loading: productTypes.search.result.loading,
      onFetchMore: productTypes.search.loadMore,
      onSearchChange: productTypes.search.search,
      value: dedupeFilter(params.productTypes || []),
    },
    stockStatus: {
      active: maybe(() => params.stockStatus !== undefined, false),
      value: maybe(() => findValueInEnum(params.stockStatus, StockAvailability)),
    },
  };
}

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
interface NumericFilterParam extends BaseFilterParam {
  valuesRange: GteLte<number>;
}
export type FilterParam =
  | BooleanFilterParam
  | DateFilterParam
  | DateTimeFilterParam
  | DefaultFilterParam
  | NumericFilterParam;

export const parseFilterValue = (
  params: ProductListUrlFilters,
  key: string,
  type: ProductListUrlFiltersAsDictWithMultipleValues,
): FilterParam => {
  const value = params[type][key];
  const isMulti = params[type][key].length > 1;
  const name = { slug: key };

  switch (type) {
    case ProductListUrlFiltersAsDictWithMultipleValues.booleanAttributes:
      return { ...name, boolean: JSON.parse(value[0]) };
    case ProductListUrlFiltersAsDictWithMultipleValues.dateAttributes:
      return {
        ...name,
        date: getGteLteVariables({
          gte: value[0] || null,
          lte: isMulti ? value[1] || null : value[0],
        }),
      };
    case ProductListUrlFiltersAsDictWithMultipleValues.dateTimeAttributes:
      return {
        ...name,
        dateTime: getGteLteVariables({
          gte: value[0] || null,
          lte: isMulti ? value[1] || null : value[0],
        }),
      };
    case ProductListUrlFiltersAsDictWithMultipleValues.numericAttributes: {
      const [gte, lte] = value.map(v => parseFloat(v));

      return {
        ...name,
        valuesRange: {
          gte: gte || undefined,
          lte: isMulti ? lte || undefined : gte || undefined,
        },
      };
    }
    default:
      return { ...name, values: value };
  }
};

function getFilteredAttributeValue(params: ProductListUrlFilters): FilterParam[] {
  const attrValues = Object.values(ProductListUrlFiltersAsDictWithMultipleValues).reduce<
    FilterParam[]
  >((attrValues, attributeType) => {
    const attributes = params[attributeType];

    if (!attributes) {
      return attrValues;
    }

    return [
      ...attrValues,
      ...Object.keys(attributes).map(key => parseFilterValue(params, key, attributeType)),
    ];
  }, []);

  if (!attrValues.length) {
    return null;
  }

  return attrValues;
}

// TODO: Remove this function when productListingPageFiltersFlag is removed
export function getLegacyFilterVariables(
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
    productTypes: params.productTypes !== undefined ? params.productTypes : null,
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

  if (group) {
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
      return getMultipleValueQueryParam(filter, ProductListUrlFiltersWithMultipleValues.categories);

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
        filter as FilterElementRegular<ProductFilterKeys>,
        ProductListUrlFiltersEnum.stockStatus,
        StockAvailability,
      );

    case ProductFilterKeys.channel:
      return getSingleValueQueryParam(filter, ProductListUrlFiltersEnum.channel);

    case ProductFilterKeys.productKind:
      return getSingleValueQueryParam(filter, ProductListUrlFiltersEnum.productKind);

    case ProductFilterKeys.metadata:
      return getKeyValueQueryParam(
        filter as FilterElementKeyValue<ProductFilterKeys>,
        ProductListUrlFiltersWithKeyValueValues.metadata,
      );
  }
}

export const storageUtils = createFilterTabUtils<string>(PRODUCT_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } = createFilterUtils<
  ProductListUrlQueryParams,
  ProductListUrlFilters
>({
  ...ProductListUrlFiltersEnum,
  ...ProductListUrlFiltersWithMultipleValues,
  ...ProductListUrlFiltersAsDictWithMultipleValues,
});

export const getWhereVariables = (
  productListingPageFiltersFlag: FlagValue,
  value: FilterContainer,
): ProductWhereInput => {
  if (productListingPageFiltersFlag.enabled) {
    const queryVars = createProductQueryVariables(value);

    return queryVars;
  }

  return undefined;
};

export const getFilterVariables = ({
  isProductListingPageFiltersFlagEnabled,
  filterContainer,
  queryParams,
  isChannelSelected,
  channelSlug,
}: {
  isProductListingPageFiltersFlagEnabled: boolean;
  filterContainer: FilterContainer;
  queryParams: ProductListUrlFilters;
  isChannelSelected: boolean;
  channelSlug: string | undefined;
}) => {
  if (isProductListingPageFiltersFlagEnabled) {
    const queryVars = createProductQueryVariables(filterContainer);
    const { channel, ...where } = queryVars;

    return {
      where,
      search: queryParams.query,
      channel: channel?.eq,
    };
  }

  return {
    filter: getLegacyFilterVariables(queryParams, isChannelSelected),
    channel: channelSlug,
  };
};
