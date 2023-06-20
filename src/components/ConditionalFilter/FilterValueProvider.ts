import { FilterContainer } from "./useFilterContainer";

export interface FilterValueProvider {
  value: FilterContainer;
  loading: boolean;
  persist: (newValue: FilterContainer) => void;
}
