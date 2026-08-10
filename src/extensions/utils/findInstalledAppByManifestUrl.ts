export const normalizeManifestUrl = (manifestUrl: string): string => {
  try {
    return new URL(manifestUrl).href;
  } catch {
    return manifestUrl;
  }
};

export const findInstalledAppByManifestUrl = <
  T extends {
    manifestUrl: string | null;
  },
>(
  installedApps: T[],
  manifestUrl: string,
): T | undefined =>
  installedApps.find(
    app =>
      app.manifestUrl &&
      normalizeManifestUrl(app.manifestUrl) === normalizeManifestUrl(manifestUrl),
  );
