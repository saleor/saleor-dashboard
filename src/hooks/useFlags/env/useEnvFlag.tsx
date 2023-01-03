import { Flag } from "../types";
import { flagNameToEnvName } from "./helpers";

export const useEnvFlag = (flagName: string): Flag => {
  const flag = process.env[flagNameToEnvName(flagName)];

  if (!flag) {
    return {
      enabled: false,
      value: "",
    };
  }

  return {
    enabled: flag !== "",
    value: flag,
  };
};
