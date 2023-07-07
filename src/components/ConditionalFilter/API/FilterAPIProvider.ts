import { FilterContainer } from "../FilterElement";
import { ItemOption } from "../FilterElement/ConditionValue";

export interface FilterAPIProvider {
  fetchRightOptions: (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => Promise<ItemOption[]>;
}
