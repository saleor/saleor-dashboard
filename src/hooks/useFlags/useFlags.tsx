import { FlagsResults, FlagWithName } from "./types";
import { useAllEnvFlags, useEnvFlags } from "./useEnvFlags";
import { useAllFlagsmithFlags, useFlagsmithFlags } from "./useFlagsmithFlags";

export const useFlags = <T extends readonly string[]>(
  flags: readonly [...T],
  traits?: string[],
): FlagsResults<T> => {
  const flagsmishFlags = useFlagsmithFlags(flags, traits);
  const envFlags = useEnvFlags(flags);
  const isFeatureFlagsEnabled = process.env.FLAGS_ENABLED;

  if (isFeatureFlagsEnabled === "true") {
    return flagsmishFlags;
  }

  return envFlags;
};

export const useAllFlags = (): FlagWithName[] => {
  const envFlags = useAllEnvFlags();
  const flagsmishFlags = useAllFlagsmithFlags();

  const isFeatureFlagsEnabled = process.env.FLAGS_ENABLED;

  if (isFeatureFlagsEnabled === "true") {
    return flagsmishFlags;
  }

  return envFlags;
};
