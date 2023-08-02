import { FilterContainer, FilterElement } from "./FilterElement";

export interface FilterValueProvider {
  value: FilterContainer;
  loading: boolean;
  persist: (newValue: FilterContainer) => void;
  isPersisted: (element: FilterElement) => boolean;
  clear: () => void;
  count: number;
}
