import { channelsCatalogEntries } from "./channels";
import { configurationHubsCatalogEntries } from "./hubs";
import { ordersCatalogEntries } from "./orders";
import { refundsCatalogEntries } from "./refunds";
import { storeCatalogEntries } from "./store";
import { type SettingsCatalogEntry } from "./types";

/**
 * Single client-side settings index for Configuration search and Cmd+K.
 * Add new settings here (with a matching DOM hash on the hub) when shipping UI.
 * Channel-only concepts may omit hash until the channel config view has anchors.
 */
export const settingsCatalogEntries: SettingsCatalogEntry[] = [
  ...ordersCatalogEntries,
  ...refundsCatalogEntries,
  ...storeCatalogEntries,
  ...channelsCatalogEntries,
  ...configurationHubsCatalogEntries,
];

export { allSettingsHashes, settingsHashes, settingsHref } from "./hashes";
export { resolveSettingsCatalog, resolveSettingsCatalogEntry } from "./resolve";
export { searchSettingsCatalog } from "./search";
export type {
  ResolvedSettingsCatalogEntry,
  SettingsCatalogEntry,
  SettingsCatalogKind,
  SettingsCatalogOwnership,
} from "./types";
export { useResolvedSettingsCatalog, useSettingsCatalogSearch } from "./useSettingsCatalogSearch";
