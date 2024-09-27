import { useUser } from "@dashboard/auth";
import LoginLoading from "@dashboard/auth/components/LoginLoading/LoginLoading";
import React, { ReactNode, useEffect, useState } from "react";

import { FlagList } from "./availableFlags";
import { Provider } from "./context";
import { FlagsResolver } from "./FlagsResolver";
import { AvailableStrategies, EnvVarsStrategy, LocalStorageStrategy } from "./strategies";
import { MetadataStrategy } from "./strategies/MetadataStrategy";

interface FeatureFlagsProviderProps {
  children: ReactNode;
  strategies: AvailableStrategies[];
  deps?: unknown[];
}

const FeatureFlagsProvider = ({ children, strategies }: FeatureFlagsProviderProps) => {
  const [flags, setFlags] = useState<FlagList | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const disableLoading = () => setLoading(false);

  useEffect(() => {
    const resolver = new FlagsResolver(strategies);

    resolver.fetchAll().combineWithPriorities().then(setFlags).finally(disableLoading);
  }, [strategies]);

  return <Provider value={flags}>{loading ? <LoginLoading /> : children}</Provider>;
};

interface FeatureFlagsProviderWithUserProps {
  children: ReactNode;
}

export const FeatureFlagsProviderWithUser = ({ children }: FeatureFlagsProviderWithUserProps) => {
  const user = useUser();

  return (
    <FeatureFlagsProvider
      strategies={[
        new LocalStorageStrategy(),
        new EnvVarsStrategy(),
        new MetadataStrategy(user.user?.metadata || []),
      ]}
    >
      {children}
    </FeatureFlagsProvider>
  );
};
