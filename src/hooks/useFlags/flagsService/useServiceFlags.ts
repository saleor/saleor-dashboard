import { useFlags } from "flagsmith/react";
import snakeCase from "lodash/snakeCase";

import { FlagsResults } from "../types";

export const useServiceFlags = <T extends readonly string[]>(
  flags: readonly [...T],
  traits?: string[],
): FlagsResults<T> => {
  const flagsmithFlags = useFlags(transformFlagsToSnakeCase(flags), traits);

  return flags.reduce((acc, flag) => {
    const flagName = snakeCase(flag);
    if (flagsmithFlags[flagName]) {
      acc[flag] = {
        enabled: flagsmithFlags[flagName].enabled,
        value: flagsmithFlags[flagName].value ?? "",
      };
    }

    return acc;
  }, {} as FlagsResults<T>);
};

function transformFlagsToSnakeCase(flags: readonly string[]): string[] {
  return flags.map(flag => snakeCase(flag));
}
