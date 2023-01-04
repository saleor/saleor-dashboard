import { useFlags } from "flagsmith/react";
import snakeCase from "lodash/snakeCase";

import { Flag } from "../types";

export const useFlagsmithFlag = (flagName: string, traits?: string[]): Flag => {
  const flagSnakeCase = snakeCase(flagName);
  const flags = useFlags([flagSnakeCase], traits);

  return {
    enabled: flags[flagSnakeCase].enabled,
    value: flags[flagSnakeCase].value ?? "",
  };
};
