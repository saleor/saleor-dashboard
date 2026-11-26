import { getSaleorCloudAppDomain } from "@dashboard/config";

/**
 * Returns true when the URL is hosted under the Saleor app domain (exact host or
 * subdomain). When the URL cannot be parsed, it cannot be verified as official and
 * the function returns false.
 */
export const isSaleorOfficialAppUrl = (url: string): boolean => {
  const cloudDomain = getSaleorCloudAppDomain();

  try {
    const { hostname } = new URL(url);

    return hostname === cloudDomain || hostname.endsWith(`.${cloudDomain}`);
  } catch {
    return false;
  }
};
