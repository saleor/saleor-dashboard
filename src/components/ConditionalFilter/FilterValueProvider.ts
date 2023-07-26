import { FilterContainer } from "./FilterElement";

export interface FilterValueProvider {
  value: FilterContainer;
  loading: boolean;
  persist: (newValue: FilterContainer) => void;
  clear: () => void;
  count: number;
}
