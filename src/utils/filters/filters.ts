import { IFilterElement, IFilter } from "@saleor/components/Filter";

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
  return Array.from(new Set(array));
}

export function getFilterQueryParams<
  TFilterKeys extends string,
  TUrlFilters extends object
>(
  filter: IFilter<TFilterKeys>,
  getFilterQueryParam: (filter: IFilterElement<TFilterKeys>) => TUrlFilters
): TUrlFilters {
  return filter.reduce(
    (acc, filterField) => ({
      ...acc,
      ...getFilterQueryParam(filterField)
    }),
    {} as TUrlFilters
  );
}

export default createFilterUtils;
