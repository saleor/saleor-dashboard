import { useAllEnvFlags, useEnvFlags } from "./env";
import { useAllFlagsmithFlags, useFlagsmithFlags } from "./flagsmith";
import { FlagsResults, FlagWithName } from "./types";

export const useFlags = <T extends readonly string[]>(
  flags: readonly [...T],
  traits?: string[],
): FlagsResults<T> => {
  const flagsmithFlags = useFlagsmithFlags(flags, traits);
  const envFlags = useEnvFlags(flags);
  const isFeatureFlagsServiceEnabled = process.env.FLAGS_SERVICE_ENABLED;

  if (isFeatureFlagsServiceEnabled === "true") {
    return flagsmithFlags;
  }

  return envFlags;
};

export const useAllFlags = (): FlagWithName[] => {
  const envFlags = useAllEnvFlags();
  const flagsmithFlags = useAllFlagsmithFlags();

  const isFeatureFlagsServiceEnabled = process.env.FLAGS_SERVICE_ENABLED;

  if (isFeatureFlagsServiceEnabled === "true") {
    return flagsmithFlags;
  }

  return envFlags;
};

export { FeatureFlagsProvider } from "./featureFlagsProvider";
