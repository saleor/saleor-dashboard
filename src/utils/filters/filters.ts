import isArray from "lodash-es/isArray";

import { IFilterElement, IFilter } from "@saleor/components/Filter";
import { findValueInEnum } from "@saleor/misc";

function createFilterUtils<
  TQueryParams extends object,
  TFilters extends object
>(filters: object) {
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

  return {
    areFiltersApplied,
    getActiveFilters
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
  TFilters extends object
> = (filter: IFilterElement<TFilterKeys>, params?: object) => TFilters;
export function getFilterQueryParams<
  TFilterKeys extends string,
  TUrlFilters extends object
>(
  filter: IFilter<TFilterKeys>,
  getFilterQueryParam: GetFilterQueryParam<TFilterKeys, TUrlFilters>
): TUrlFilters {
  return filter.reduce(
    (acc, filterField) => ({
      ...acc,
      ...getFilterQueryParam(filterField, acc)
    }),
    {} as TUrlFilters
  );
}

type GteLte<T> = Partial<Record<"gte" | "lte", T>>;
export function getGteLteVariables<T>(variables: GteLte<T>): GteLte<T> | null {
  if (
    !![variables.gte, variables.lte].some(
      v => v !== undefined && v !== null && !(typeof v === "number" && isNaN(v))
    )
  ) {
    return variables;
  }

  return null;
}

export function getSingleValueQueryParam<
  TKey extends string,
  TUrlKey extends string
>(param: IFilterElement<TKey>, key: TUrlKey) {
  const { active, value } = param;

  if (!active) {
    return {
      [key]: undefined
    };
  }

  return {
    [key]: value[0]
  };
}

export function getSingleEnumValueQueryParam<
  TKey extends string,
  TUrlKey extends string,
  TEnum extends object
>(param: IFilterElement<TKey>, key: TUrlKey, haystack: TEnum) {
  const { active, value } = param;

  if (!active) {
    return {
      [key]: undefined
    };
  }

  return {
    [key]: findValueInEnum(value[0], haystack)
  };
}

export function getMultipleEnumValueQueryParam<
  TKey extends string,
  TUrlKey extends string,
  TEnum extends object
>(param: IFilterElement<TKey>, key: TUrlKey, haystack: TEnum) {
  const { active, value } = param;

  if (!active) {
    return {
      [key]: undefined
    };
  }

  return {
    [key]: value.map(val => findValueInEnum(val, haystack))
  };
}

export function getMultipleValueQueryParam<
  TKey extends string,
  TUrlKey extends string
>(param: IFilterElement<TKey>, key: TUrlKey) {
  const { active, value } = param;

  if (!active) {
    return {
      [key]: undefined
    };
  }

  return {
    [key]: value
  };
}

export function getMinMaxQueryParam<
  TKey extends string,
  TUrlKey extends string
>(param: IFilterElement<TKey>, keyFrom: TUrlKey, keyTo: TUrlKey) {
  const { active, multiple, value } = param;

  if (!active) {
    return {
      [keyFrom]: undefined,
      [keyTo]: undefined
    };
  }

  if (multiple) {
    return {
      [keyFrom]: value[0],
      [keyTo]: value[1]
    };
  }

  return {
    [keyFrom]: value[0],
    [keyTo]: value[0]
  };
}

export default createFilterUtils;
