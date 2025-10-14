import { AppInstallationFragment } from "@dashboard/graphql";

/** @deprecated use type from extensions/ */
export interface AppLogo {
  source?: string;
}

/** @deprecated use type from extensions/ */
export interface AppInstallation {
  appInstallation: AppInstallationFragment;
  isExternal: boolean;
  logo?: AppLogo;
}
