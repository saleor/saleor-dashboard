import { FlagWithName } from "../types";
import {
  envNameToFlagName,
  isFlagEnabled,
  readAllFlagsFromEnv,
} from "./helpers";

export const useAllEnvFlags = (): FlagWithName[] => {
  const flags = readAllFlagsFromEnv();

  return Object.entries(flags).map(([flagKey, flagValue]) => ({
    name: envNameToFlagName(flagKey),
    enabled: isFlagEnabled(flagValue),
    value: flagValue,
  }));
};
