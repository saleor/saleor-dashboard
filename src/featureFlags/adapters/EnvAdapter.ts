import { FeatureFlagAdapter } from "../types";

export class EnvAdapter implements FeatureFlagAdapter {
  getFlagInfo(flagName: string) {
    const flag = process.env[flagName];

    return {
      enabled: flag !== "" ? true : false,
      value: flag,
    };
  }
}
