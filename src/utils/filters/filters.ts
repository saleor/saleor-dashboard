function createFilterUtils<
  TQueryParams extends object,
  TFilters extends object
>(filters: object) {
  function getActiveFilters(params: TQueryParams): TFilters {
    return Object.keys(params)
      .filter(key => Object.keys(filters).includes(key))
      .reduce(
        (acc, key) => {
          acc[key] = params[key];
          return acc;
        },
        {} as any
      );
  }

  function areFiltersApplied(params: TQueryParams): boolean {
    return Object.keys(getActiveFilters(params)).some(key => !!params[key]);
  }

  return {
    areFiltersApplied,
    getActiveFilters
  };
}

export function valueOrFirst<T>(value: T | T[]): T {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function arrayOrValue<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

export function arrayOrUndefined<T>(array: T[]): T[] | undefined {
  if (array.length === 0) {
    return undefined;
  }

  return array;
}

export function dedupeFilter<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export default createFilterUtils;
