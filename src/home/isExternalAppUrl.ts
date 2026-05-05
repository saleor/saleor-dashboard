import { getSaleorCloudAppDomain } from "@dashboard/config";

export const isExternalAppUrl = (url: string): boolean => {
  const cloudDomain = getSaleorCloudAppDomain();

  if (cloudDomain === null) {
    return true;
  }

  try {
    const { hostname } = new URL(url);

    return hostname !== cloudDomain && !hostname.endsWith(`.${cloudDomain}`);
  } catch {
    return true;
  }
};
