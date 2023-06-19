import { FilterElement } from "./FilterElement";

export interface FilterValueProvider {
  value: Array<string | FilterElement>;
  loading: boolean;
  persist: (newValue: Array<string | FilterElement>) => void;
}
