interface UserFilter<TUrlFilters> {
  name: string;
  data: TUrlFilters;
}

export type GetFilterTabsOutput<TUrlFilters> = Array<UserFilter<TUrlFilters>>;
export interface StorageUtils<TUrlFilters> {
  getFilterTabs: () => GetFilterTabsOutput<TUrlFilters>;
  deleteFilterTab: (id: number) => void;
  saveFilterTab: (name: string, data: TUrlFilters) => void;
  updateFilterTab: (name: string, data: TUrlFilters) => void;
}
