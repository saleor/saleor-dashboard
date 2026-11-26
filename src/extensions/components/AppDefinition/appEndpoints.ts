import { isSaleorOfficialAppUrl } from "@dashboard/extensions/isSaleorOfficialAppUrl";
import { type AppQuery, type PermissionEnum } from "@dashboard/graphql";

export interface AppDefinitionPermission {
  code: PermissionEnum;
  name: string;
}

/**
 * What an app declares, whether it comes from a fetched manifest or from the installed app.
 * A manifest fragment fits this shape as is; an installed app goes through
 * `installedAppDefinition`.
 */
interface AppDefinition {
  version: string | null;
  appUrl: string | null;
  tokenTargetUrl: string | null;
  permissions: AppDefinitionPermission[] | null;
  extensions: Array<{
    label: string;
    url: string;
    mountName: string;
    targetName: string;
    permissions: AppDefinitionPermission[];
  }>;
  /** `null` when the viewer can't read the app's webhooks. */
  webhooks: Array<{
    name: string;
    targetUrl: string;
    syncEvents: string[] | null;
    asyncEvents: string[] | null;
  }> | null;
}

type InstalledApp = NonNullable<AppQuery["app"]>;

export const installedAppDefinition = (app: InstalledApp): AppDefinition => ({
  version: app.version,
  appUrl: app.appUrl,
  // Saleor doesn't expose where the installed app's token was sent.
  tokenTargetUrl: null,
  permissions: app.permissions,
  extensions: app.extensions,
  webhooks:
    app.webhooks?.map(webhook => ({
      name: webhook.name ?? "",
      targetUrl: webhook.targetUrl,
      syncEvents: webhook.syncEvents.map(event => event.eventType),
      asyncEvents: webhook.asyncEvents.map(event => event.eventType),
    })) ?? null,
});

interface ResolvedUrl {
  /** Absolute URL, or the raw value when it cannot be parsed. */
  url: string;
  /** Hostname, or the raw value when the URL cannot be parsed. */
  host: string;
}

export type AppEndpoint =
  | (ResolvedUrl & { kind: "manifest" | "app" | "tokenTarget" })
  | (ResolvedUrl & { kind: "webhook"; name: string; events: string[] })
  | (ResolvedUrl & {
      kind: "extension";
      label: string;
      mountName: string;
      targetName: string;
      permissions: string[];
    });

export type AppEndpointOf<Kind extends AppEndpoint["kind"]> = Extract<AppEndpoint, { kind: Kind }>;

export interface AppEndpointGroup {
  host: string;
  endpoints: AppEndpoint[];
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
 * Every URL the app is reached at. Extension and webhook URLs may be relative to
 * `appUrl`, so they are resolved against it.
 */
export const getAppEndpoints = (
  manifestUrl: string | null,
  app: Pick<AppDefinition, "appUrl" | "tokenTargetUrl" | "extensions" | "webhooks">,
): AppEndpoint[] => {
  const base = app.appUrl ?? manifestUrl ?? undefined;

  return [
    ...(manifestUrl ? [{ kind: "manifest" as const, ...resolveUrl(manifestUrl) }] : []),
    ...(app.appUrl ? [{ kind: "app" as const, ...resolveUrl(app.appUrl) }] : []),
    ...(app.tokenTargetUrl
      ? [{ kind: "tokenTarget" as const, ...resolveUrl(app.tokenTargetUrl) }]
      : []),
    ...app.extensions.map(extension => ({
      kind: "extension" as const,
      ...resolveUrl(extension.url, base),
      label: extension.label,
      mountName: extension.mountName,
      targetName: extension.targetName,
      permissions: extension.permissions.map(permission => permission.name),
    })),
    ...(app.webhooks ?? []).map(webhook => ({
      kind: "webhook" as const,
      ...resolveUrl(webhook.targetUrl, base),
      name: webhook.name,
      events: [...(webhook.syncEvents ?? []), ...(webhook.asyncEvents ?? [])],
    })),
  ];
};

/** Groups endpoints by host, keeping the manifest's host first. */
export const groupEndpointsByHost = (endpoints: AppEndpoint[]): AppEndpointGroup[] => {
  const groups = new Map<string, AppEndpoint[]>();

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
export const isOfficialManifest = (endpoints: AppEndpoint[]): boolean =>
  endpoints.every(endpoint => isSaleorOfficialAppUrl(endpoint.url));
