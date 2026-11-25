import { isSaleorOfficialAppUrl } from "@dashboard/extensions/isSaleorOfficialAppUrl";

import { type Manifest } from "./types";

interface ResolvedUrl {
  /** Absolute URL, or the raw value when it cannot be parsed. */
  url: string;
  /** Hostname, or the raw value when the URL cannot be parsed. */
  host: string;
}

export type ManifestEndpoint =
  | (ResolvedUrl & { kind: "manifest" | "app" | "tokenTarget" | "extension" })
  | (ResolvedUrl & { kind: "webhook"; name: string; events: string[] });

export type ManifestEndpointKind = ManifestEndpoint["kind"];

export interface ManifestEndpointGroup {
  host: string;
  endpoints: ManifestEndpoint[];
}

const resolveUrl = (url: string, base?: string): ResolvedUrl => {
  try {
    const resolved = new URL(url, base);

    return { url: resolved.href, host: resolved.hostname };
  } catch {
    return { url, host: url };
  }
};

/**
 * Every URL the app will be reached at once installed. Extension URLs may be
 * relative to `appUrl`, so they are resolved against it.
 */
export const getManifestEndpoints = (
  manifestUrl: string,
  manifest: Pick<Manifest, "appUrl" | "tokenTargetUrl" | "extensions" | "webhooks">,
): ManifestEndpoint[] => {
  const base = manifest.appUrl ?? manifestUrl;

  return [
    { kind: "manifest", ...resolveUrl(manifestUrl) },
    ...(manifest.appUrl ? [{ kind: "app" as const, ...resolveUrl(manifest.appUrl) }] : []),
    ...(manifest.tokenTargetUrl
      ? [{ kind: "tokenTarget" as const, ...resolveUrl(manifest.tokenTargetUrl) }]
      : []),
    ...manifest.extensions.map(extension => ({
      kind: "extension" as const,
      ...resolveUrl(extension.url, base),
    })),
    ...manifest.webhooks.map(webhook => ({
      kind: "webhook" as const,
      ...resolveUrl(webhook.targetUrl, base),
      name: webhook.name,
      events: [...(webhook.syncEvents ?? []), ...(webhook.asyncEvents ?? [])],
    })),
  ];
};

/** Groups endpoints by host, keeping the manifest's host first. */
export const groupEndpointsByHost = (endpoints: ManifestEndpoint[]): ManifestEndpointGroup[] => {
  const groups = new Map<string, ManifestEndpoint[]>();

  endpoints.forEach(endpoint => {
    groups.set(endpoint.host, [...(groups.get(endpoint.host) ?? []), endpoint]);
  });

  return Array.from(groups, ([host, hostEndpoints]) => ({ host, endpoints: hostEndpoints }));
};

/**
 * An app is official only when every endpoint is on the Saleor app domain. Checking
 * the manifest URL alone would let an official-looking manifest send the app token
 * or webhook payloads to another host.
 */
export const isOfficialManifest = (endpoints: ManifestEndpoint[]): boolean =>
  endpoints.every(endpoint => isSaleorOfficialAppUrl(endpoint.url));
