import { Name as FlagName } from "./availableFlags";
import { useFeatureFlagContext } from "./context";
import { FlagContent } from "./FlagContent";

export const useFlag = (name: FlagName) => {
  const context = useFeatureFlagContext();
  const flag = context[name];

  if (!flag) {
    return FlagContent.empty();
  }

  return context[name];
};
