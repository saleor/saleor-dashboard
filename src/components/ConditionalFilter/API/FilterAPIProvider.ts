import { type FilterContainer } from "../FilterElement";
import { type ItemOption } from "../FilterElement/ConditionValue";
import { type LeftOperand } from "../LeftOperandsProvider";

export interface FilterAPIProvider {
  fetchRightOptions: (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => Promise<ItemOption[]>;
  fetchAttributeOptions: (inputValue: string) => Promise<LeftOperand[]>;
}
