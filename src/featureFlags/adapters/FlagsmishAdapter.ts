import flagsmith from "flagsmith";

import { FeatureFlagAdapter } from "../types";

flagsmith.init({
  environmentID: import.meta.env.VITE_FLAGSMISH_ID,
  cacheFlags: false,
});

export class FlagsmmishAdapter implements FeatureFlagAdapter {
  getFlagInfo(flagName: string) {
    return {
      enabled: flagsmith.hasFeature(flagName),
      value: flagsmith.getValue(flagName),
    };
  }
}
