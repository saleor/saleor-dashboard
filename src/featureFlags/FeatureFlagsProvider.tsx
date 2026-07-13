import LoginLoading from "@dashboard/auth/components/LoginLoading/LoginLoading";
import { UserContext } from "@dashboard/auth/useUser";
import { type MetadataItemFragment } from "@dashboard/graphql";
import { type ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { type FlagList } from "./availableFlags";
import { Provider } from "./context";
import { FlagsResolver } from "./FlagsResolver";
import { type AvailableStrategies, EnvVarsStrategy, LocalStorageStrategy } from "./strategies";
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

const EMPTY_METADATA: MetadataItemFragment[] = [];

export const FeatureFlagsProviderWithUser = ({ children }: FeatureFlagsProviderWithUserProps) => {
  // Use raw auth context — UI permission override must not re-resolve feature flags.
  const user = useContext(UserContext);
  const metadata = user.user?.metadata ?? EMPTY_METADATA;
  const metadataKey = JSON.stringify(metadata);
  const strategies = useMemo(
    () => [new LocalStorageStrategy(), new EnvVarsStrategy(), new MetadataStrategy(metadata)],
    [metadataKey],
  );

  return <FeatureFlagsProvider strategies={strategies}>{children}</FeatureFlagsProvider>;
};
