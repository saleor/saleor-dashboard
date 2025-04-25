// @ts-strict-ignore
import { FilterContainer } from "@dashboard/components/ConditionalFilter/FilterElement";
import { createProductQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { FlagValue } from "@dashboard/featureFlags/FlagContent";
import {
  AttributeFragment,
  AttributeInputTypeEnum,
  ProductWhereInput,
  StockAvailability,
} from "@dashboard/graphql";
import { ProductFilterKeys } from "@dashboard/products/components/ProductListPage";

import {
  FilterElement,
  FilterElementKeyValue,
  FilterElementRegular,
} from "../../../components/Filter";
import {
  createFilterTabUtils,
  createFilterUtils,
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
  filterContainer,
  queryParams,
}: {
  filterContainer: FilterContainer;
  queryParams: ProductListUrlFilters;
}) => {
  const queryVars = createProductQueryVariables(filterContainer);
  const { channel, ...where } = queryVars;

  return {
    where,
    search: queryParams.query,
    channel: channel?.eq,
  };
};
