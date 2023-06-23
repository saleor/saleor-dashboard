import LoginLoading from "@dashboard/auth/components/LoginLoading/LoginLoading";
import React, { ReactNode, useEffect, useState } from "react";

import { FlagList } from "./availableFlags";
import { Provider } from "./context";
import { useFlagsResolver } from "./FlagsResolver";
import { AvailableStrategies } from "./strategies";

interface FeatureFlagsProviderProps {
  children: ReactNode;
  strategies: AvailableStrategies[];
}

export const FeatureFlagsProvider = ({
  children,
  strategies,
}: FeatureFlagsProviderProps) => {
  const resolver = useFlagsResolver(strategies);
  const [flags, setFlags] = useState<FlagList | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const disableLoading = () => setLoading(false);

  useEffect(() => {
    resolver
      .fetchAll()
      .combineWithPriorities()
      .then(setFlags)
      .finally(disableLoading);
  }, []);

  return (
    <Provider value={flags}>{loading ? <LoginLoading /> : children}</Provider>
  );
};
