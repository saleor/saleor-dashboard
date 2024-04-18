interface UserFilter<TUrlFilters> {
  name: string;
  data: TUrlFilters;
}

export type GetFilterTabsOutput<TUrlFilters> = Array<UserFilter<TUrlFilters>>;

function getFilterTabs<TUrlFilters>(key: string): GetFilterTabsOutput<TUrlFilters> {
  const filterTabs = localStorage.getItem(key);
  return filterTabs ? JSON.parse(filterTabs) : [];
}

function saveFilterTab<TUrlFilters>(name: string, data: TUrlFilters, key: string) {
  const userFilters = getFilterTabs<TUrlFilters>(key);

  localStorage.setItem(
    key,
    JSON.stringify([
      ...userFilters,
      {
        data,
        name,
      },
    ]),
  );
}

function updateFilterTab<TUrlFilters>(tabName: string, data: TUrlFilters, key: string) {
  const userFilters = getFilterTabs<TUrlFilters>(key);
  const updatedFilters = userFilters.map(tab => {
    if (tab.name === tabName) {
      return {
        data,
        name: tabName,
      };
    }

    return tab;
  });

  localStorage.setItem(key, JSON.stringify([...updatedFilters]));
}

function deleteFilterTab(id: number, key: string) {
  const userFilters = getFilterTabs(key);

  localStorage.setItem(
    key,
    JSON.stringify([...userFilters.slice(0, id - 1), ...userFilters.slice(id)]),
  );
}
export interface StorageUtils<TUrlFilters> {
  getFilterTabs: () => GetFilterTabsOutput<TUrlFilters>;
  deleteFilterTab: (id: number) => void;
  saveFilterTab: (name: string, data: TUrlFilters) => void;
  updateFilterTab: (name: string, data: TUrlFilters) => void;
}

function createFilterTabUtils<TUrlFilters>(key: string): StorageUtils<TUrlFilters> {
  return {
    deleteFilterTab: (id: number) => deleteFilterTab(id, key),
    getFilterTabs: () => getFilterTabs<TUrlFilters>(key),
    saveFilterTab: (name: string, data: TUrlFilters) => saveFilterTab<TUrlFilters>(name, data, key),
    updateFilterTab: (tabName: string, data: TUrlFilters) =>
      updateFilterTab<TUrlFilters>(tabName, data, key),
  };
}

export default createFilterTabUtils;
