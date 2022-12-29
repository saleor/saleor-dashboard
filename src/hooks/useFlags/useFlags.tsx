import { FlagsResults } from "./types";
import { useEnvFlags } from "./useEnvFlags";
import { useFlagsmishFlags } from "./useFlagsmishFlags";

export const useFlags = <T extends readonly string[]>(
  flags: readonly [...T],
  traits?: string[],
): FlagsResults<T> => {
  const flagsmishFlags = useFlagsmishFlags(flags, traits);
  const envFlags = useEnvFlags(flags);
  const isFeatureFlagsEnabled = process.env.FLAGS_ENABLED;

  if (isFeatureFlagsEnabled === "true") {
    return flagsmishFlags;
  }

  return envFlags;
};
