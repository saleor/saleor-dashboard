import { findInstalledAppByManifestUrl } from "./findInstalledAppByManifestUrl";
import { findInstalledAppFromUniqueError } from "./findInstalledAppFromUniqueError";

export const findInstalledAppByIdentifier = <
  T extends {
    identifier: string | null;
  },
>(
  installedApps: T[],
  identifier: string,
): T | undefined => installedApps.find(app => app.identifier === identifier);

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
