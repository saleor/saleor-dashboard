import { type FilterContainer } from "@dashboard/components/ConditionalFilter/FilterElement";

interface HasActiveListFiltersParams<TFilter> {
  filterContainer: FilterContainer;
  searchQuery?: string;
  createFilterVariables: (container: FilterContainer) => TFilter;
}

export const hasActiveListFilters = <TFilter extends object | null | undefined>({
  filterContainer,
  searchQuery,
  createFilterVariables,
}: HasActiveListFiltersParams<TFilter>): boolean => {
  if (searchQuery?.trim()) {
    return true;
  }

  const filter = createFilterVariables(filterContainer);

  return !!filter && typeof filter === "object" && Object.keys(filter).length > 0;
};
