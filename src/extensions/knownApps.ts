import { ExtensionsUrls } from "@dashboard/extensions/urls";
import {
  CUSTOMER_EMAILS_APP_IDENTIFIER,
  CUSTOMER_EMAILS_MANIFEST_URL,
} from "@dashboard/notificationsSettings/constants";

interface KnownApp {
  identifier: string;
  manifestUrl: string;
  name: string;
}

/**
 * Official Saleor apps that Dashboard can open by manifest identifier
 * (`/extensions/app/<identifier>`) and install from a hosted manifest.
 */
const knownApps: Record<string, KnownApp> = {
  [CUSTOMER_EMAILS_APP_IDENTIFIER]: {
    identifier: CUSTOMER_EMAILS_APP_IDENTIFIER,
    manifestUrl: CUSTOMER_EMAILS_MANIFEST_URL,
    name: "Customer Emails",
  },
};

export const getKnownApp = (identifier: string): KnownApp | undefined => knownApps[identifier];

/** Hosted install path when this identifier is a known app that is not installed. */
export const getKnownAppInstallUrl = (identifier: string): string | null => {
  const known = getKnownApp(identifier);

  if (!known) {
    return null;
  }

  return ExtensionsUrls.resolveInstallCustomExtensionUrl(known.manifestUrl);
};

/** Portable Dashboard URL for an app’s current install, or its identifier if none is open yet. */
export const getKnownAppViewUrl = (identifier: string): string =>
  ExtensionsUrls.resolveViewManifestExtensionUrl(identifier);
