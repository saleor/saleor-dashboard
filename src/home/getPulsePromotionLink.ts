import pulsePoster from "@assets/images/cover-big-pulse-by-saleor.png";
import { ExtensionsUrls } from "@dashboard/extensions/urls";

export const PULSE_MANIFEST_URL = "https://pulse.saleor.app/api/manifest";

/** App Store listing for open-source / non-cloud Dashboards. */
export const PULSE_APPS_STORE_URL = "https://apps.saleor.io/apps/pulse";

/** Official Pulse promo video from saleor.io (CORS-open CDN). */
export const PULSE_VIDEO_URL = "https://saleor.io/blog/20260716_pulse/pulse.mp4";

/** Local poster shown before the promo video loads / when autoplay is blocked. */
export const PULSE_POSTER_URL: string = pulsePoster;

export type PulsePromotionIntent = "install" | "open" | "explore";

export type PulsePromotionLink =
  | { kind: "internal"; to: string; intent: PulsePromotionIntent }
  | { kind: "external"; href: string; intent: "explore" };

export const isPulseManifestUrl = (manifestUrl: string): boolean => {
  try {
    return new URL(manifestUrl).href === new URL(PULSE_MANIFEST_URL).href;
  } catch {
    return manifestUrl === PULSE_MANIFEST_URL;
  }
};

/**
 * Cloud: deep-link into the Dashboard install flow for Pulse on the current env.
 * Open source: send merchants to the App Store listing (Pulse install is Cloud-hosted).
 * When Pulse is already installed, link to its extension page like any other app.
 */
export function getPulsePromotionLink(
  isCloudInstance: boolean,
  options?: { installedAppUrl?: string | null },
): PulsePromotionLink {
  if (options?.installedAppUrl) {
    return {
      kind: "internal",
      to: options.installedAppUrl,
      intent: "open",
    };
  }

  if (isCloudInstance) {
    return {
      kind: "internal",
      to: ExtensionsUrls.resolveInstallCustomExtensionUrl(PULSE_MANIFEST_URL),
      intent: "install",
    };
  }

  return {
    kind: "external",
    href: PULSE_APPS_STORE_URL,
    intent: "explore",
  };
}
