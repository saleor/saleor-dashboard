import { FlagWithName } from "../types";
import { envNameToFlagName, readAllFlagsFromEnv } from "./helpers";

export const useAllEnvFlags = (): FlagWithName[] => {
  const flags = readAllFlagsFromEnv();

  return Object.entries(flags).map(([flagKey, flagValue]) => ({
    name: envNameToFlagName(flagKey),
    enabled: flagValue !== "",
    value: flagValue,
  }));
};
