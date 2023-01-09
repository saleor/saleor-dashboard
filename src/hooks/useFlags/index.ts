import { useAllEnvFlags, useEnvFlags } from "./env";
import { useAllFlagsmithFlags, useFlagsmithFlags } from "./flagsmith";
import { FlagsResults, FlagWithName } from "./types";

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
