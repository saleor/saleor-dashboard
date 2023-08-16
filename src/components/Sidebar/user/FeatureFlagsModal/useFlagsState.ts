import { FlagDefinition, Name } from "@dashboard/featureFlags/availableFlags";
import { useFlagsInfo } from "@dashboard/featureFlags/useFlagsInfo";
import { useState } from "react";

type changeTab = (name: Name) => void;

type FlagsState =
  | { hasNoFlags: false; selectedFlag: FlagDefinition; changeTab: changeTab }
  | { hasNoFlags: true; selectedFlag: undefined; changeTab: changeTab };

export const useFlagsState = (): FlagsState => {
  const flagsInfo = useFlagsInfo();
  const flags = flagsInfo.filter(f => f.visible);
  const firstFlag = flags.length > 0 ? flags[0].name : null;
  const [tab, changeTab] = useState(firstFlag);
  const selectedFlag = flags.find(f => f.name === tab);

  if (!selectedFlag) {
    return {
      hasNoFlags: true,
      selectedFlag: undefined,
      changeTab,
    };
  }

  return {
    hasNoFlags: false,
    selectedFlag,
    changeTab,
  };
};
