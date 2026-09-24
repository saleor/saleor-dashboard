import { type FilterContainer } from "./FilterElement/FilterElement";

export const getAnalyticsFilterKeys = (container: FilterContainer): string[] =>
  container.flatMap(filter => {
    if (typeof filter === "string") {
      return [];
    }

    if (Array.isArray(filter)) {
      return getAnalyticsFilterKeys(filter);
    }

    return [filter.value.value];
  });
