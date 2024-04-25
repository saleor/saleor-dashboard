import { AppInstallationFragment, AppListItemFragment } from "@dashboard/graphql";

export interface AppLogo {
  source?: string;
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
