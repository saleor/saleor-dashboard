// @ts-strict-ignore
import { FilterContainer } from "@dashboard/components/ConditionalFilter/FilterElement";
import { FiltersQueryBuilder } from "@dashboard/components/ConditionalFilter/FiltersQueryBuilder";
import { QueryApiType } from "@dashboard/components/ConditionalFilter/FiltersQueryBuilder/types";
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
 * Converts filter field names from internal format to export API format.
 * The export API uses plural field names (collections, categories, productTypes)
 * while internal representation may use singular forms.
 * Also handles price field format conversion.
 */
const normalizeFilterFieldsForExport = (filter: any): ProductFilterInput => {
  const normalized: any = { ...filter };

  // Convert singular field names to plural for export API
  if (normalized.collection !== undefined) {
    normalized.collections = normalized.collection;
    delete normalized.collection;
  }

  if (normalized.category !== undefined) {
    normalized.categories = normalized.category;
    delete normalized.category;
  }

  if (normalized.productType !== undefined) {
    normalized.productTypes = normalized.productType;
    delete normalized.productType;
  }

  // Handle price field format - must be an object with gte/lte, not a string
  if (normalized.price !== undefined) {
    // If price is a string or number, convert it to proper PriceRangeInput format
    if (typeof normalized.price === "string" || typeof normalized.price === "number") {
      const priceValue = parseFloat(String(normalized.price));

      if (!Number.isNaN(priceValue)) {
        normalized.price = { gte: priceValue };
      } else {
        // If we can't parse it, remove it
        delete normalized.price;
      }
    } else if (typeof normalized.price === "object" && normalized.price !== null) {
      // If it's already an object, ensure it has the right structure
      if (!normalized.price.gte && !normalized.price.lte) {
        delete normalized.price;
      }
    }
  }

  return normalized as ProductFilterInput;
};

/**
 * Builds a ProductFilterInput for product export operations using the legacy FILTER API.
 *
 * Reuses the ConditionalFilter's FiltersQueryBuilder to ensure consistency with the main
 * product list filtering logic. This avoids duplicating filter building logic and ensures
 * both list filtering and export use the same filter transformations.
 *
 * The FILTER API is the legacy export endpoint format that differs from the modern WHERE API.
 *
 * @param filterContainer - The current filter state from ConditionalFilter context
 * @returns ProductFilterInput compatible with exportProducts mutation, or empty object if no filters
 *
 * @example
 * const filter = createProductQueryVariablesLegacyInput(filterContainer);
 * // Returns: { search: "shirt", categories: ["id1"], price: { gte: 10 }, ... }
 */
export const createProductQueryVariablesLegacyInput = (
  filterContainer: FilterContainer,
): InputMaybe<ProductFilterInput> => {
  if (!filterContainer) {
    return {} as InputMaybe<ProductFilterInput>;
  }

  const builder = new FiltersQueryBuilder<ProductFilterInput, "channel">({
    apiType: QueryApiType.FILTER,
    filterContainer,
    topLevelKeys: ["channel"],
  });
  const { filters } = builder.build();

  // Normalize field names for export API compatibility
  return normalizeFilterFieldsForExport({ ...filters }) as InputMaybe<ProductFilterInput>;
};
