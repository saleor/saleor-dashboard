interface UserFilter<TUrlFilters> {
  name: string;
  data: TUrlFilters;
}

export type GetFilterTabsOutput<TUrlFilters> = Array<UserFilter<TUrlFilters>>;

function getFilterTabs<TUrlFilters>(key: string): GetFilterTabsOutput<TUrlFilters> {
  const filterTabs = localStorage.getItem(key);

  return filterTabs ? JSON.parse(filterTabs) : [];
}
export interface StorageUtils<TUrlFilters> {
  getFilterTabs: () => GetFilterTabsOutput<TUrlFilters>;
  deleteFilterTab: (id: number) => void;
  saveFilterTab: (name: string, data: TUrlFilters) => void;
  updateFilterTab: (name: string, data: TUrlFilters) => void;
}
