import pulsePoster from "@assets/images/cover-big-pulse-by-saleor.png";
import { ExtensionsUrls } from "@dashboard/extensions/urls";

export const PULSE_MANIFEST_URL = "https://pulse.saleor.app/api/manifest";

/** App Store listing for open-source / non-cloud Dashboards. */
export const PULSE_APPS_STORE_URL = "https://apps.saleor.io/apps/pulse";

/** Official Pulse promo video from saleor.io (CORS-open CDN). */
export const PULSE_VIDEO_URL = "https://saleor.io/blog/20260716_pulse/pulse.mp4";

/** Local poster shown before the promo video loads / when autoplay is blocked. */
export const PULSE_POSTER_URL: string = pulsePoster;

export type PulsePromotionLink =
  | { kind: "internal"; to: string }
  | { kind: "external"; href: string };

/**
 * Cloud: deep-link into the Dashboard install flow for Pulse on the current env.
 * Open source: send merchants to the App Store listing (Pulse install is Cloud-hosted).
 */
export function getPulsePromotionLink(isCloudInstance: boolean): PulsePromotionLink {
  if (isCloudInstance) {
    return {
      kind: "internal",
      to: ExtensionsUrls.resolveInstallCustomExtensionUrl(PULSE_MANIFEST_URL),
    };
  }

  return {
    kind: "external",
    href: PULSE_APPS_STORE_URL,
  };
}
