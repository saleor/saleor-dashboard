import {
  FilterElement,
  FilterElementKeyValue,
  FilterElementRegular,
  IFilter,
} from "@saleor/components/Filter";
import { findValueInEnum } from "@saleor/misc";
import { ActiveTab } from "@saleor/types";
import isArray from "lodash/isArray";

function createFilterUtils<
  TQueryParams extends {},
  TFilters extends {}
>(filters: {}) {
  function getActiveFilters(params: TQueryParams): TFilters {
    return Object.keys(params)
      .filter(key => Object.keys(filters).includes(key))
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as any);
  }

  function areFiltersApplied(params: TQueryParams): boolean {
    return Object.keys(getActiveFilters(params)).some(key => !!params[key]);
  }

  function getFiltersCurrentTab<TQueryTabParams extends ActiveTab>(
    params: TQueryTabParams,
    tabs: unknown[],
  ) {
    return params.activeTab === undefined
      ? areFiltersApplied((params as unknown) as TQueryParams)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 10);
  }

  return {
    areFiltersApplied,
    getActiveFilters,
    getFiltersCurrentTab,
  };
}

export function dedupeFilter<T>(array: T[]): T[] {
  if (!isArray(array)) {
    return [array];
  }

  return Array.from(new Set(array));
}

export type GetFilterQueryParam<
  TFilterKeys extends string,
  TFilters extends {}
> = (filter: FilterElement<TFilterKeys>, params?: {}) => TFilters;
export function getFilterQueryParams<
  TFilterKeys extends string,
  TUrlFilters extends {}
>(
  filters: IFilter<TFilterKeys>,
  getFilterQueryParam: GetFilterQueryParam<TFilterKeys, TUrlFilters>,
): TUrlFilters {
  return filters.reduce(
    (acc, filterField) => ({
      ...acc,
      ...getFilterQueryParam(filterField, acc),
    }),
    {} as TUrlFilters,
  );
}

export type GteLte<T> = Partial<Record<"gte" | "lte", T>>;
export function getGteLteVariables<T>(variables: GteLte<T>): GteLte<T> | null {
  if (
    !![variables.gte, variables.lte].some(
      v =>
        v !== undefined && v !== null && !(typeof v === "number" && isNaN(v)),
    )
  ) {
    return variables;
  }

  return null;
}

export function getSingleValueQueryParam<
  TKey extends string,
  TUrlKey extends string
>(param: FilterElement<TKey>, key: TUrlKey) {
  const { active, value } = param;

  if (!active) {
    return {
      [key]: undefined,
    };
  }

  return {
    [key]: value[0],
  };
}

export function getSingleEnumValueQueryParam<
  TKey extends string,
  TUrlKey extends string,
  TEnum extends {}
>(param: FilterElementRegular<TKey>, key: TUrlKey, haystack: TEnum) {
  const { active, value } = param;

  if (!active) {
    return {
      [key]: undefined,
    };
  }

  return {
    [key]: findValueInEnum(value[0], haystack),
  };
}

export function getMultipleEnumValueQueryParam<
  TKey extends string,
  TUrlKey extends string,
  TEnum extends {}
>(param: FilterElementRegular<TKey>, key: TUrlKey, haystack: TEnum) {
  const { active, value } = param;

  if (!active) {
    return {
      [key]: undefined,
    };
  }

  return {
    [key]: value.map(val => findValueInEnum(val, haystack)),
  };
}

export function getMultipleValueQueryParam<
  TKey extends string,
  TUrlKey extends string
>(param: FilterElement<TKey>, key: TUrlKey) {
  const { active, value } = param;

  if (!active) {
    return {
      [key]: undefined,
    };
  }

  return {
    [key]: value,
  };
}

export function getMinMaxQueryParam<
  TKey extends string,
  TUrlKey extends string
>(param: FilterElement<TKey>, keyFrom: TUrlKey, keyTo: TUrlKey) {
  const { active, multiple, value } = param;

  if (!active) {
    return {
      [keyFrom]: undefined,
      [keyTo]: undefined,
    };
  }

  if (multiple) {
    return {
      [keyFrom]: value[0],
      [keyTo]: value[1],
    };
  }

  return {
    [keyFrom]: value[0],
    [keyTo]: value[0],
  };
}

export function getKeyValueQueryParam<
  TKey extends string,
  TUrlKey extends string
>(param: FilterElementKeyValue<TKey>, key: TUrlKey) {
  const { active, value } = param;

  if (!active) {
    return {
      [key]: undefined,
    };
  }

  const filledOutPairs = value.filter(keyValuePair => keyValuePair.key !== "");

  return {
    [key]: filledOutPairs,
  };
}

export default createFilterUtils;
