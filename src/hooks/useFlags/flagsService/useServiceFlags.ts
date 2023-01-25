import { FlagsResults } from "../types";

export const useServiceFlags = <T extends readonly string[]>(
  flags: readonly [...T],
): FlagsResults<T> =>
  flags.reduce((acc, flag) => {
    acc[flag] = {
      enabled: false,
      value: "",
    };

    return acc;
  }, {} as FlagsResults<T>);
