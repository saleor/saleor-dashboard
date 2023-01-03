import { FlagWithName } from "../types";
import { ENV_FLAG_PREFIX } from "./const";
import { envNameToFlagName } from "./helpers";

export const useAllEnvFlags = (): FlagWithName[] =>
  Object.entries(process.env)
    .filter(([envKey]) => envKey.startsWith(ENV_FLAG_PREFIX))
    .map(([flagKey, flagValue]) => ({
      name: envNameToFlagName(flagKey),
      enabled: flagValue !== "",
      value: flagValue || "",
    }));
