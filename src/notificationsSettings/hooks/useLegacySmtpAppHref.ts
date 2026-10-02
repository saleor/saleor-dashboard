import { readInstalledAppsSnapshot } from "@dashboard/extensions/installed-apps-snapshot";
import { getKnownAppViewUrl } from "@dashboard/extensions/knownApps";
import { findInstalledAppByIdentifier } from "@dashboard/extensions/utils/findInstalledAppByIdentifier";
import { useInstalledAppsSnapshotQuery } from "@dashboard/graphql";
import { SMTP_APP_IDENTIFIER } from "@dashboard/notificationsSettings/constants";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export interface LegacySmtpAppLink {
  identifier: string | null;
}

/**
 * Canonical Dashboard path for an installed SMTP app
 * (`/extensions/app/saleor.app.smtp`), or null when this shop does not have it.
 */
export const legacySmtpAppHref = (apps: LegacySmtpAppLink[] | null | undefined): string | null => {
  const app = findInstalledAppByIdentifier(apps ?? [], SMTP_APP_IDENTIFIER);

  if (!app) {
    return null;
  }

  return getKnownAppViewUrl(SMTP_APP_IDENTIFIER);
};

/**
 * Live query once it has resolved. Until then, the installed-apps snapshot
 * already on the page — so a shop with SMTP does not paint one card and then
 * grow a second row.
 */
export const appsForLegacySmtpLink = (
  queried: LegacySmtpAppLink[] | undefined,
  cached: LegacySmtpAppLink[],
): LegacySmtpAppLink[] => queried ?? cached;

export const useLegacySmtpAppHref = (): string | null => {
  const { data } = useInstalledAppsSnapshotQuery();

  return legacySmtpAppHref(
    appsForLegacySmtpLink(mapEdgesToItems(data?.apps), readInstalledAppsSnapshot()),
  );
};
