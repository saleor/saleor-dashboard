import { type ExtensionListQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

export type ExtensionSnapshotNode = RelayToFlat<
  NonNullable<ExtensionListQuery["appExtensions"]>
>[number];

const KEY_PREFIX = "dashboard-extensions-snapshot";

export const getExtensionsSnapshotKey = (mountList: readonly string[]): string =>
  `${KEY_PREFIX}:${[...mountList].sort().join(",")}`;

export const readExtensionsSnapshot = (key: string): ExtensionSnapshotNode[] | null => {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const writeExtensionsSnapshot = (key: string, nodes: ExtensionSnapshotNode[]): void => {
  try {
    // Never persist the access token — it is the only secret and can go stale.
    const sanitized = nodes.map(node => ({ ...node, accessToken: "" }));

    localStorage.setItem(key, JSON.stringify(sanitized));
  } catch {
    // Storage may be unavailable (quota, privacy mode); degrade silently.
  }
};
