import { useAllEnvFlags, useEnvFlags } from "./env";
import { useAllFlagsmithFlags, useFlagsmithFlags } from "./flagsmith";
import { FlagsResults, FlagWithName } from "./types";

const useFlagsHook = FLAGS_SERVICE_ENABLED ? useFlagsmithFlags : useEnvFlags;
const useAllFlagsHook = FLAGS_SERVICE_ENABLED
  ? useAllFlagsmithFlags
  : useAllEnvFlags;

export const useFlags = <T extends readonly string[]>(
  flags: readonly [...T],
  traits?: string[],
): FlagsResults<T> => {
  const results = useFlagsHook(flags, traits);
  return results;
};

export const useAllFlags = (): FlagWithName[] => {
  const results = useAllFlagsHook();
  return results;
};

export { FeatureFlagsProvider } from "./featureFlagsProvider";
