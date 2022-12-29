import { useFlags, useFlagsmith } from "flagsmith/react";

import { FlagsResults, FlagWithName } from "./types";

export const useFlagsmithFlags = <T extends readonly string[]>(
  flags: readonly [...T],
  traits?: string[],
): FlagsResults<T> => {
  const flagsmishFlags = useFlags(flags, traits);

  return flags.reduce((acc, flag) => {
    if (flagsmishFlags[flag]) {
      acc[flag] = {
        enabled: flagsmishFlags[flag].enabled,
        value: flagsmishFlags[flag].value || "",
      };
    }

    return acc;
  }, {} as FlagsResults<T>);
};

export const useAllFlagsmithFlags = (): FlagWithName[] => {
  const flagsmith = useFlagsmith();
  const flags = flagsmith.getAllFlags();

  return Object.entries(flags).map(([name, { value, enabled }]) => ({
    name,
    value: value || "",
    enabled,
  }));
};
