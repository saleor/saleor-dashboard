import { AppListItemFragment } from "@dashboard/graphql";

export interface InstalledApp {
  app: AppListItemFragment;
  isExternal: boolean;
}

export interface AppLink {
  name: string;
  url: string;
}
