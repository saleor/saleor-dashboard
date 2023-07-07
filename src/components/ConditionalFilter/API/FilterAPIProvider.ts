import { FilterContainer } from "../FilterElement";
import { ItemOption } from "../FilterElement/ConditionValue";
import { LeftOperand } from "../useLeftOperands";

export interface FilterAPIProvider {
  fetchRightOptions: (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => Promise<ItemOption[]>;
  fetchLeftOptions: (inputValue: string) => Promise<LeftOperand[]>;
}
