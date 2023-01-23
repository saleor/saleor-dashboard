import {
  AppInstallationFragment,
  AppListItemFragment,
} from "@dashboard/graphql";

interface AppLogo {
  source: string | null;
  color: string;
}

export interface InstalledApp {
  app: AppListItemFragment;
  isExternal: boolean;
  logo?: AppLogo;
}

export interface AppInstallation {
  appInstallation: AppInstallationFragment;
  isExternal: boolean;
  logo?: AppLogo;
}

export interface AppLink {
  name: string;
  url: string;
}
