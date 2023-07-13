import { FilterContainer } from "../FilterElement";
import { ItemOption } from "../FilterElement/ConditionValue";
import { LeftOperand } from "../LeftOperandsProvider";
import { FetchingParams } from "../ValueProvider/TokenArray/fetchingParams";
import { InitialStateResponse } from "./InitialStateResponse";

export interface FilterAPIProvider {
  fetchRightOptions: (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => Promise<ItemOption[]>;
  fetchLeftOptions: (inputValue: string) => Promise<LeftOperand[]>;
  useInitialState: (fetchingParams: FetchingParams) => {
    data: InitialStateResponse;
    loading: boolean;
  };
}
