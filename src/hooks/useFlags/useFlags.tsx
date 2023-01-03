import { FlagsResults, FlagWithName } from "./types";
import { useAllEnvFlags, useEnvFlags } from "./useEnvFlags";
import { useAllFlagsmithFlags, useFlagsmithFlags } from "./useFlagsmithFlags";

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

export const useAllFlags = (): FlagWithName[] => {
  const envFlags = useAllEnvFlags();
  const flagsmithFlags = useAllFlagsmithFlags();

  const isFeatureFlagsEnabled = process.env.FLAGS_ENABLED;

  if (isFeatureFlagsEnabled === "true") {
    return flagsmithFlags;
  }

  return envFlags;
};
