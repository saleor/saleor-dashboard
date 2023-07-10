import { Name as FlagName } from "./availableFlags";
import { useFeatureFlagContext } from "./context";
import { FlagValue } from "./FlagContent";

export const useFlag = (name: FlagName) => {
  const context = useFeatureFlagContext();
  const flag = context[name];

  if (!flag) {
    return FlagValue.empty();
  }

  return context[name];
};
