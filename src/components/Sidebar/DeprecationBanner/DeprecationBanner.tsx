import React from "react";

import { DeprecationBannerContent } from "./DeprecationBannerContent";

/**
 * Hardcoded deprecation banner for the 3.20 Dashboard build.
 *
 * This whole build targets a deprecated Saleor version, so the banner is always
 * shown. The upgrade date is hardcoded intentionally (not read from env vars).
 */
const UPGRADE_DATE = new Date(2026, 6, 1); // 1 July 2026

export const DeprecationBanner = () => <DeprecationBannerContent upgradeDate={UPGRADE_DATE} />;
