import { ReactNode } from "react";

export interface FeatureFlagDetails {
  enabled: boolean;
  value: string | number | boolean;
}

export interface FeatureFlagAdapter {
  getFlagInfo(flagName: string): FeatureFlagDetails;
}

export interface FeatureFlagsProviderProps {
  adapter: FeatureFlagAdapter;
  children: ReactNode;
}
