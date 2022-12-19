import { AppListItemFragment } from "@saleor/graphql";

export interface InstalledApp {
  app: AppListItemFragment;
  isExternal: boolean;
}
