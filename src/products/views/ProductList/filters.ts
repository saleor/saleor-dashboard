// @ts-strict-ignore
import { FilterContainer } from "@dashboard/components/ConditionalFilter/FilterElement";
import { createProductQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import {
  AttributeFragment,
  AttributeInputTypeEnum,
  InputMaybe,
  ProductFilterInput,
  StockAvailability,
} from "@dashboard/graphql";
import { ProductFilterKeys } from "@dashboard/products/components/ProductListPage";

import {
  FilterElement,
  FilterElementKeyValue,
  FilterElementRegular,
} from "../../../components/Filter/types";
import {
  createFilterTabUtils,
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
} from "../../urls";

const PRODUCT_FILTERS_KEY = "productPresets";

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

/**
 * Converts URL query parameters into a GraphQL ProductFilterInput object
 * for product export operations.
 *
 * @param queryParams - Current URL filter parameters from ProductListUrlFilters
 * @returns ProductFilterInput compatible with exportProducts mutation, or empty object if no filters
 *
 * @example
 * const filter = getExportProductFilter({
 *   queryParams: { query: "shirt", channel: "default-channel" }
 * });
 * // Returns: { search: "shirt", channel: "default-channel" }
 */
export const getExportProductFilter = ({ queryParams }: { queryParams: ProductListUrlFilters }) => {
  if (!queryParams) {
    return {} as InputMaybe<ProductFilterInput>;
  }

  const filterInput: Partial<ProductFilterInput> = {};

  // Include search phrase
  if (queryParams.query) {
    filterInput.search = queryParams.query;
  }

  // Add channel filter
  if (queryParams.channel) {
    filterInput.channel = queryParams.channel;
  }

  // Add categories filter
  if (queryParams.categories) {
    filterInput.categories = queryParams.categories;
  }

  // Add collections filter
  if (queryParams.collections) {
    filterInput.collections = queryParams.collections;
  }

  // Add product type filter
  if (queryParams.productTypes) {
    filterInput.productTypes = queryParams.productTypes;
  }

  // Add price range filter
  const hasPriceFilter = queryParams.priceFrom !== undefined || queryParams.priceTo !== undefined;

  if (hasPriceFilter) {
    const minimalPrice = {
      ...(queryParams.priceFrom && { gte: parseFloat(queryParams.priceFrom) }),
      ...(queryParams.priceTo && { lte: parseFloat(queryParams.priceTo) }),
    };

    // Only add minimalPrice if it has at least one property
    if (Object.keys(minimalPrice).length > 0) {
      filterInput.minimalPrice = minimalPrice;
    }
  }

  // Add stock filter
  if (queryParams.stockStatus) {
    filterInput.stockAvailability = queryParams.stockStatus as StockAvailability;
  }

  // Add attribute filters from different attribute types
  const attributes: Array<{ slug: string; values: string[] }> = [];
  const attributeTypes = [
    "string-attributes",
    "numeric-attributes",
    "boolean-attributes",
    "date-attributes",
    "datetime-attributes",
  ] as const;

  attributeTypes.forEach(attrType => {
    if (queryParams[attrType]) {
      Object.entries(queryParams[attrType]).forEach(([slug, values]) => {
        if (values?.length > 0) {
          attributes.push({ slug, values });
        }
      });
    }
  });

  if (attributes.length > 0) {
    filterInput.attributes = attributes;
  }

  return filterInput as InputMaybe<ProductFilterInput>;
};
