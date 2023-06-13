import { FilterElement } from "./FilterElement";

export interface FilterValueProvider {
  value: (string | FilterElement)[],
  persist: (newValue: (string | FilterElement)[]) => void
}

