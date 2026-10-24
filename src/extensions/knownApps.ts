import { ExtensionsUrls } from "@dashboard/extensions/urls";
import {
  CUSTOMER_EMAILS_APP_IDENTIFIER,
  CUSTOMER_EMAILS_MANIFEST_URL,
  GOOGLE_MERCHANT_CENTER_MANIFEST_URL,
  PRODUCT_FEED_APP_IDENTIFIER,
  SMTP_APP_IDENTIFIER,
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

/** Deprecated app identifier → manifest URL of its replacement. Hardcoded until the API exposes it. */
const deprecatedAppReplacements: Record<string, string> = {
  [SMTP_APP_IDENTIFIER]: CUSTOMER_EMAILS_MANIFEST_URL,
  [PRODUCT_FEED_APP_IDENTIFIER]: GOOGLE_MERCHANT_CENTER_MANIFEST_URL,
};

/** Install path of the app that replaces this deprecated app, if one is known. */
export const getReplacementAppInstallUrl = (identifier: string | null): string | null => {
  const manifestUrl = identifier ? deprecatedAppReplacements[identifier] : undefined;

  return manifestUrl ? ExtensionsUrls.resolveInstallCustomExtensionUrl(manifestUrl) : null;
};
