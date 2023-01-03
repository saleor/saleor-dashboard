import { useAllEnvFlags, useEnvFlag, useEnvFlags } from "./env";
import {
  useAllFlagsmithFlags,
  useFlagsmithFlag,
  useFlagsmithFlags,
} from "./flagsmith";
import { Flag, FlagsResults, FlagWithName } from "./types";

export const useFlags = <T extends readonly string[]>(
  flags: readonly [...T],
  traits?: string[],
): FlagsResults<T> => {
  const flagsmithFlags = useFlagsmithFlags(flags, traits);
  const envFlags = useEnvFlags(flags);
  const isFeatureFlagsEnabled = process.env.FLAGS_ENABLED;

  if (isFeatureFlagsEnabled === "true") {
    return flagsmithFlags;
  }

  return envFlags;
};

export const useFlag = (flagName: string, traits?: string[]): Flag => {
  const envFalg = useEnvFlag(flagName);
  const flagsmithFlag = useFlagsmithFlag(flagName, traits);

  const isFeatureFlagsEnabled = process.env.FLAGS_ENABLED;

  if (isFeatureFlagsEnabled === "true") {
    return flagsmithFlag;
  }

  return envFalg;
};

export const useAllFlags = (): FlagWithName[] => {
  const envFlags = useAllEnvFlags();
  const flagsmithFlags = useAllFlagsmithFlags();

  const isFeatureFlagsEnabled = process.env.FLAGS_ENABLED;

  if (isFeatureFlagsEnabled === "true") {
    return flagsmithFlags;
  }

  return envFlags;
};
