import { type FilterContainer, type FilterElement } from "./FilterElement";
import { type UrlToken } from "./ValueProvider/UrlToken";

export interface FilterValueProvider {
  value: FilterContainer;
  loading: boolean;
  persist: (newValue: FilterContainer) => void;
  isPersisted: (element: FilterElement) => boolean;
  clear: () => void;
  getTokenByName: (name: string) => UrlToken | undefined;
  count: number;
}
