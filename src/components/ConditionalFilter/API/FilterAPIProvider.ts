import { type FilterContainer } from "../FilterElement";
import { type LeftOperand } from "../LeftOperandsProvider";
import { type FilterChoicesPage } from "./filterChoicesPage";

export type { FilterChoicesPage } from "./filterChoicesPage";

export interface FilterAPIProvider {
  fetchRightOptions: (
    position: string,
    value: FilterContainer,
    inputValue: string,
    after?: string | null,
  ) => Promise<FilterChoicesPage>;
  fetchAttributeOptions: (
    inputValue: string,
    after?: string | null,
  ) => Promise<FilterChoicesPage<LeftOperand>>;
}
