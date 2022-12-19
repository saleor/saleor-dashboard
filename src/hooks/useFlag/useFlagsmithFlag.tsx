import flagsmith from "flagsmith";

import { Flag } from "./types";

flagsmith.init({
  environmentID: process.env.FLAGSMISH_ID,
  cacheFlags: false,
});

export const useFlagsmithFlag = (flags: string[]): Flag[] =>
  flags.map(flag => ({
    enabled: flagsmith.hasFeature(flag),
    value: flagsmith.getValue(flag),
  }));
