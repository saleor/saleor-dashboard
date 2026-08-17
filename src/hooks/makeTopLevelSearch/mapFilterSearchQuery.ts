/**
 * Prefer `search()` state when set; otherwise keep a variables-driven filter.search
 * from callers that drive search through React state / onFilterChange (assign pickers).
 * Always overwriting with "" was resetting parent-owned queries on every render.
 */
export const mapFilterSearchQuery = <
  TVariables extends { filter?: { search?: string | null } | null },
>(
  searchQuery: string,
  variables: TVariables,
): TVariables => ({
  ...variables,
  filter: {
    ...variables.filter,
    search: searchQuery || variables.filter?.search || "",
  },
});
