import { useFlags } from "flagsmith/react";

import { FlagsResults } from "./types";

export const useFlagsmishFlags = <T extends readonly string[]>(
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
