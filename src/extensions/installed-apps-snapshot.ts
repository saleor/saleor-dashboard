import { type InstalledAppsSnapshotQuery, useInstalledAppsSnapshotQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useEffect } from "react";

export type InstalledAppSnapshotNode = RelayToFlat<
  NonNullable<InstalledAppsSnapshotQuery["apps"]>
>[number];

const STORAGE_KEY = "dashboard-installed-apps-snapshot";

export const readInstalledAppsSnapshot = (): InstalledAppSnapshotNode[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const writeInstalledAppsSnapshot = (nodes: InstalledAppSnapshotNode[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
  } catch {
    // Storage may be unavailable (quota, privacy mode); degrade silently.
  }
};

/**
 * Keeps the cached apps list fresh. Mount once in the authenticated tree - the
 * snapshot is what makes identifier -> app resolution available synchronously.
 */
export const useRefreshInstalledAppsSnapshot = (): void => {
  const { data } = useInstalledAppsSnapshotQuery({ fetchPolicy: "network-only" });

  useEffect(() => {
    const apps = mapEdgesToItems(data?.apps);

    if (apps) {
      writeInstalledAppsSnapshot(apps);
    }
  }, [data?.apps]);
};
