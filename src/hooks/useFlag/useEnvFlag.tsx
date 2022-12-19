import { Flag } from "./types";

export const useEnvFlag = (flags: string[]): Flag[] =>
  flags.map(flag => {
    const flagValue = process.env[flag];

    return {
      enabled: !!flagValue,
      value: flagValue,
    };
  });
