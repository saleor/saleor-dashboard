import { useFlagsmith } from "flagsmith/react";
import camelCase from "lodash/camelCase";

import { FlagWithName } from "../types";

export const useAllServiceFlags = (): FlagWithName[] => {
  const flagsmith = useFlagsmith();
  const flags = flagsmith.getAllFlags();

  return Object.entries(flags).map(([name, { value, enabled }]) => ({
    name: camelCase(name),
    value: value ?? "",
    enabled,
  }));
};
