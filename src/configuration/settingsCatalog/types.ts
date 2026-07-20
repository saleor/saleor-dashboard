import { type PermissionEnum } from "@dashboard/graphql";
import { type MessageDescriptor } from "react-intl";

export type SettingsCatalogKind = "hub" | "section" | "setting";

export type SettingsCatalogOwnership = "shop" | "channel";

/**
 * Declarative settings index entry. Titles/keywords stay as MessageDescriptors
 * so search runs on the active locale after resolve.
 */
export interface SettingsCatalogEntry {
  id: string;
  title: MessageDescriptor;
  description?: MessageDescriptor;
  keywords?: MessageDescriptor[];
  breadcrumbs: MessageDescriptor[];
  /** Path including optional hash, e.g. `/orders/settings#automatically-confirm`. */
  href: string;
  /** DOM id without `#` — must match an element on the destination hub when kind is setting/section. */
  hash?: string;
  permissions?: PermissionEnum[];
  /** When true, every permission in `permissions` is required (default: any). */
  requireAllPermissions?: boolean;
  ownership?: SettingsCatalogOwnership;
  kind: SettingsCatalogKind;
}

export interface ResolvedSettingsCatalogEntry {
  id: string;
  title: string;
  description: string;
  keywords: string;
  breadcrumbs: string;
  breadcrumbPath: string;
  href: string;
  hash?: string;
  ownership?: SettingsCatalogOwnership;
  kind: SettingsCatalogKind;
  searchText: string;
}
