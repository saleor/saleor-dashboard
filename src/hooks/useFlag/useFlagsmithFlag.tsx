import flagsmith from "flagsmith";
import { IFlags } from "flagsmith/types";
import { useEffect, useState } from "react";

import { Flag } from "./types";

export const useFlagsmithFlag = (flagNames: string[]): Flag[] => {
  const [flags, setFlags] = useState<IFlags<string>>({});

  useEffect(() => {
    flagsmith.init({
      environmentID: process.env.FLAGSMISH_ID || "",
      cacheFlags: true,
      onChange() {
        setFlags(flagsmith.getAllFlags());
      },
    });
  }, []);

  return flagNames.reduce<Flag[]>((acc, flagName) => {
    if (flags[flagName]) {
      acc.push({
        name: flagName,
        enabled: flags[flagName].enabled,
        value: flags[flagName].value || "",
      });
    }

    return acc;
  }, []);
};

export const useAllFlagsmishFlags = (): Flag[] => {
  const [flags, setFlags] = useState<Flag[]>([]);

  useEffect(() => {
    flagsmith.init({
      environmentID: process.env.FLAGSMISH_ID || "",
      cacheFlags: true,
      onChange: () => {
        const all = flagsmith.getAllFlags();
        setFlags(
          Object.entries(all).map(([name, params]) => ({
            name,
            value: params.value || "",
            enabled: params.enabled,
          })),
        );
      },
    });
  }, []);

  return flags;
};
