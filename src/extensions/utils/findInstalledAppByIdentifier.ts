import { getKnownApp } from "@dashboard/extensions/knownApps";

import {
  findInstalledAppByManifestUrl,
  normalizeManifestUrl,
} from "./findInstalledAppByManifestUrl";
import { findInstalledAppFromUniqueError } from "./findInstalledAppFromUniqueError";

export const findInstalledAppByIdentifier = <
  T extends {
    identifier: string | null;
  },
>(
  installedApps: T[],
  identifier: string,
): T | undefined => installedApps.find(app => app.identifier === identifier);

/**
 * Resolves an installed app the same way App Bridge `RedirectToApp` does:
 * manifest identifier first, then the hosted manifest URL for known apps
 * whose Saleor record has a missing identifier.
 */
export const findInstalledAppForIdentifier = <
  T extends {
    identifier: string | null;
    manifestUrl?: string | null;
    name?: string | null;
  },
>(
  installedApps: T[],
  identifier: string,
): T | undefined => {
  const byIdentifier = findInstalledAppByIdentifier(installedApps, identifier);

  if (byIdentifier) {
    return byIdentifier;
  }

  const known = getKnownApp(identifier);

  if (!known) {
    return undefined;
  }

  const expectedManifest = normalizeManifestUrl(known.manifestUrl);

  return installedApps.find(
    app =>
      !app.identifier &&
      app.manifestUrl != null &&
      normalizeManifestUrl(app.manifestUrl) === expectedManifest,
  );
};

export const findAlreadyInstalledApp = <
  T extends {
    identifier: string | null;
    manifestUrl: string | null;
    name: string | null;
  },
>(
  installedApps: T[],
  {
    identifier,
    manifestUrl,
    uniqueError,
  }: {
    identifier?: string | null;
    manifestUrl?: string | null;
    uniqueError?: {
      field?: string | null;
      message?: string | null;
    };
  },
): T | undefined => {
  if (identifier) {
    const appByIdentifier = findInstalledAppByIdentifier(installedApps, identifier);

    if (appByIdentifier) {
      return appByIdentifier;
    }
  }

  if (uniqueError) {
    const appFromUniqueError = findInstalledAppFromUniqueError(installedApps, uniqueError);

    if (appFromUniqueError) {
      return appFromUniqueError;
    }
  }

  if (manifestUrl) {
    return findInstalledAppByManifestUrl(installedApps, manifestUrl);
  }

  return undefined;
};
