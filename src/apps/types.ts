import { AppInstallationFragment, AppListItemFragment } from "@dashboard/graphql";

/** @deprecated use type from extensions/ */
export interface AppLogo {
  source?: string;
}

/** @deprecated use type from extensions/ */
export interface InstalledApp {
  app: AppListItemFragment;
  isExternal: boolean;
  logo?: AppLogo;
}

/** @deprecated use type from extensions/ */
export interface AppInstallation {
  appInstallation: AppInstallationFragment;
  isExternal: boolean;
  logo?: AppLogo;
}

/** @deprecated use type from extensions/ */
export interface AppLink {
  name: string;
  url: string;
}
