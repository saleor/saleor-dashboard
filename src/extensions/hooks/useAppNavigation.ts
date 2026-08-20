import { useApolloClient } from "@apollo/client";
import {
  type InstalledAppSnapshotNode,
  readInstalledAppsSnapshot,
  writeInstalledAppsSnapshot,
} from "@dashboard/extensions/installed-apps-snapshot";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { findInstalledAppByIdentifier } from "@dashboard/extensions/utils/findInstalledAppByIdentifier";
import { resolveInstalledAppHref } from "@dashboard/extensions/utils/resolveInstalledAppHref";
import { InstalledAppsSnapshotDocument, type InstalledAppsSnapshotQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback } from "react";

/**
 * Resolves apps by their manifest identifier (the app ID is per-instance, the
 * identifier is not) and navigates to them.
 */
export const useAppNavigation = () => {
  const client = useApolloClient();
  const navigate = useNavigator();
  /**
   * Cached list can be stale (app installed in another tab or after this page
   * loaded), so a miss is double-checked against the API before giving up.
   */
  const resolveApp = useCallback(
    async (identifier: string): Promise<InstalledAppSnapshotNode | null> => {
      const cachedApp = findInstalledAppByIdentifier(readInstalledAppsSnapshot(), identifier);

      if (cachedApp) {
        return cachedApp;
      }

      const { data } = await client.query<InstalledAppsSnapshotQuery>({
        query: InstalledAppsSnapshotDocument,
        fetchPolicy: "network-only",
      });
      const apps = mapEdgesToItems(data?.apps) ?? [];

      writeInstalledAppsSnapshot(apps);

      return findInstalledAppByIdentifier(apps, identifier) ?? null;
    },
    [client],
  );
  const resolveAppIdFromIdentifier = useCallback(
    async (identifier: string): Promise<string | null> =>
      (await resolveApp(identifier))?.id ?? null,
    [resolveApp],
  );
  const resolveAppUrlFromIdentifier = useCallback(
    async (identifier: string, path?: string): Promise<string | null> => {
      const app = await resolveApp(identifier);

      if (!app) {
        return null;
      }

      return path ? ExtensionsUrls.resolveAppDeepUrl(app.id, path) : resolveInstalledAppHref(app);
    },
    [resolveApp],
  );
  /**
   * Returns false when no app with such identifier is installed - the caller
   * decides what to do instead (e.g. send the user to Explore Extensions).
   */
  const navigateToApp = useCallback(
    async ({
      identifier,
      path,
      replace,
    }: {
      identifier: string;
      path?: string;
      replace?: boolean;
    }): Promise<boolean> => {
      const url = await resolveAppUrlFromIdentifier(identifier, path);

      if (!url) {
        return false;
      }

      navigate(url, { replace });

      return true;
    },
    [navigate, resolveAppUrlFromIdentifier],
  );

  return {
    resolveAppIdFromIdentifier,
    resolveAppUrlFromIdentifier,
    navigateToApp,
  };
};
