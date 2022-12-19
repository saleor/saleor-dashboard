import { Flag } from "./types";

export const useEnvFlag = (flags: string[]): Flag[] =>
  flags.map(flag => {
    const flagValue = process.env[flag];

    return {
      name: flag,
      enabled: !!flagValue,
      value: flagValue || "",
    };
  });

export const useAllEnvFlags = (): Flag[] =>
  Object.entries(process.env)
    .filter(([envKey]) => envKey.startsWith("FF_"))
    .map(([flagKey, flagValue]) => ({
      name: flagKey,
      enabled: flagValue !== "",
      value: flagValue || "",
    }));
