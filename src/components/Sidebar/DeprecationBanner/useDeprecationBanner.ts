import useShop from "@dashboard/hooks/useShop";

import {
  type DeprecationBannerState,
  getDeprecationBannerState,
} from "./getDeprecationBannerState";

/**
 * Resolves the deprecation banner state from the build-time env config and the
 * connected Saleor version. Returns `null` when the banner should not be shown.
 */
export const useDeprecationBanner = (): DeprecationBannerState | null => {
  const shop = useShop();

  return getDeprecationBannerState({
    deprecatedVersion: process.env.DEPRECATED_SALEOR_VERSION,
    deprecatedVersionTimestamp: process.env.DEPRECATED_SALEOR_VERSION_TIMESTAMP,
    connectedVersion: shop?.version,
  });
};
