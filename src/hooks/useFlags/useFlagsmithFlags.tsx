import { useFlags, useFlagsmith } from "flagsmith/react";
import camelCase from "lodash/camelCase";
import snakeCase from "lodash/snakeCase";

import { FlagsResults, FlagWithName } from "./types";

export const useFlagsmithFlags = <T extends readonly string[]>(
  flags: readonly [...T],
  traits?: string[],
): FlagsResults<T> => {
  const flagsmithFlags = useFlags(transformFlagsToSnakeCase(flags), traits);

  return flags.reduce((acc, flag) => {
    const flagName = snakeCase(flag);
    if (flagsmithFlags[snakeCase(flagName)]) {
      acc[flag] = {
        enabled: flagsmithFlags[flagName].enabled,
        value: flagsmithFlags[flagName].value || "",
      };
    }

    return acc;
  }, {} as FlagsResults<T>);
};

export const useAllFlagsmithFlags = (): FlagWithName[] => {
  const flagsmith = useFlagsmith();
  const flags = flagsmith.getAllFlags();

  return Object.entries(flags).map(([name, { value, enabled }]) => ({
    name: camelCase(name),
    value: value || "",
    enabled,
  }));
};

function transformFlagsToSnakeCase(flags: readonly string[]): string[] {
  return flags.map(flag => snakeCase(flag));
}
