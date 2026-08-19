import { hasAllPermissions, hasAnyPermissions } from "@dashboard/auth/misc";
import { type UserFragment } from "@dashboard/graphql";
import { type IntlShape } from "react-intl";

import { type ResolvedSettingsCatalogEntry, type SettingsCatalogEntry } from "./types";

export const canAccessSettingsEntry = (
  entry: SettingsCatalogEntry,
  user: UserFragment | null | undefined,
): boolean => {
  if (!entry.permissions?.length) {
    return true;
  }

  if (!user) {
    return false;
  }

  if (entry.requireAllPermissions) {
    return hasAllPermissions(entry.permissions, user);
  }

  return hasAnyPermissions(entry.permissions, user);
};

export const resolveSettingsCatalogEntry = (
  entry: SettingsCatalogEntry,
  intl: IntlShape,
): ResolvedSettingsCatalogEntry => {
  const title = intl.formatMessage(entry.title);
  const description = entry.description ? intl.formatMessage(entry.description) : "";
  const keywordList = (entry.keywords ?? []).map(message => intl.formatMessage(message));
  const breadcrumbList = entry.breadcrumbs.map(message => intl.formatMessage(message));
  const breadcrumbs = breadcrumbList.join(" › ");
  const keywords = keywordList.join(" ");

  return {
    id: entry.id,
    title,
    description,
    keywords,
    breadcrumbs,
    breadcrumbPath: breadcrumbs,
    href: entry.href,
    hash: entry.hash,
    ownership: entry.ownership,
    kind: entry.kind,
    searchText: [title, description, keywords, breadcrumbs].filter(Boolean).join(" "),
  };
};

export const resolveSettingsCatalog = (
  entries: SettingsCatalogEntry[],
  intl: IntlShape,
  user: UserFragment | null | undefined,
): ResolvedSettingsCatalogEntry[] =>
  entries
    .filter(entry => canAccessSettingsEntry(entry, user))
    .map(entry => resolveSettingsCatalogEntry(entry, intl));
