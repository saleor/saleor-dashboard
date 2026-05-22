import { getSaleorCloudAppDomain } from "@dashboard/config";

/**
 * Returns true when the URL is hosted under the configured Saleor Cloud app
 * domain (exact host or subdomain). When the domain is not configured or the
 * URL cannot be parsed, the URL cannot be verified as official and the function
 * returns false.
 */
export const isSaleorOfficialAppUrl = (url: string): boolean => {
  const cloudDomain = getSaleorCloudAppDomain();

  if (cloudDomain === null) {
    return false;
  }

  try {
    const { hostname } = new URL(url);

    return hostname === cloudDomain || hostname.endsWith(`.${cloudDomain}`);
  } catch {
    return false;
  }
};
